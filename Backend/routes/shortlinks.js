const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const { protectRoute } = require("../middleware/authMiddleware");
const ShortLink = require("../models/ShortLink");
const ShortLinkVisit = require("../models/ShortLinkVisit");
const ShortLinkCompletion = require("../models/ShortLinkCompletion");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

const VISIT_TTL_MS = 3 * 60 * 60 * 1000;
const MIN_VERIFY_DELAY_MS = 8 * 1000;

const getFrontendBaseUrl = () =>
  (process.env.FRONTEND_BASE_URL || "http://localhost:5173").replace(/\/$/, "");

const normalizeCode = (value = "") => String(value).trim().toLowerCase();

const parseAndValidateUrl = (value) => {
  try {
    const parsed = new URL(String(value));
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const buildProviderUrl = ({ externalUrl, callbackUrl, code, visitToken }) => {
  if (externalUrl.includes("{callback}")) {
    return externalUrl.replace("{callback}", encodeURIComponent(callbackUrl));
  }

  const parsed = parseAndValidateUrl(externalUrl);
  if (!parsed) return externalUrl;

  if (!parsed.searchParams.has("callback")) {
    parsed.searchParams.set("callback", callbackUrl);
  }
  if (!parsed.searchParams.has("code")) {
    parsed.searchParams.set("code", code);
  }
  if (!parsed.searchParams.has("v")) {
    parsed.searchParams.set("v", visitToken);
  }

  return parsed.toString();
};

const formatForClient = (doc) => ({
  _id: doc._id,
  code: doc.code,
  title: doc.title,
  reward: doc.reward,
  shortlinkType: doc.shortlinkType,
  timerSeconds: doc.timerSeconds,
  verificationMethod: doc.verificationMethod,
  scheduledStartAt: doc.scheduledStartAt || null,
  scheduledEndAt: doc.scheduledEndAt || null,
  availabilityStatus: getShortlinkAvailabilityStatus(doc),
  availableNow: isShortlinkAvailableNow(doc),
  topImageUrl: doc.topImageUrl || "",
  topText: doc.topText || "",
  middleImageUrl: doc.middleImageUrl || "",
  middleText: doc.middleText || "",
  extraText: doc.extraText || "",
  actionButtonLabel: doc.actionButtonLabel || "Redirect to Website",
  isActive: doc.isActive,
});

const getShortlinkAvailabilityStatus = (doc, now = new Date()) => {
  if (!doc?.isActive) return "inactive";
  const startAt = doc.scheduledStartAt ? new Date(doc.scheduledStartAt) : null;
  const endAt = doc.scheduledEndAt ? new Date(doc.scheduledEndAt) : null;
  if (startAt && now < startAt) return "scheduled";
  if (endAt && now > endAt) return "expired";
  return "active";
};

const isShortlinkAvailableNow = (doc, now = new Date()) =>
  getShortlinkAvailabilityStatus(doc, now) === "active";

const cleanText = (value = "") => String(value || "").trim();

const parseOptionalUrl = (value) => {
  const cleaned = cleanText(value);
  if (!cleaned) return "";
  if (cleaned.startsWith("data:image/")) return cleaned;
  const parsed = parseAndValidateUrl(cleaned);
  return parsed ? parsed.toString() : null;
};

const parseContentConfig = (body = {}) => {
  const topImageUrl = parseOptionalUrl(body.topImageUrl);
  const middleImageUrl = parseOptionalUrl(body.middleImageUrl);
  if (topImageUrl === null || middleImageUrl === null) {
    return { error: "Image URLs must be valid http/https links." };
  }

  return {
    topImageUrl,
    topText: cleanText(body.topText),
    middleImageUrl,
    middleText: cleanText(body.middleText),
    extraText: cleanText(body.extraText),
    actionButtonLabel: cleanText(body.actionButtonLabel) || "Redirect to Website",
  };
};

const parseShortlinkConfig = (body = {}) => {
  const shortlinkType = ["starter", "standard", "advanced", "premium"].includes(
    body.shortlinkType
  )
    ? body.shortlinkType
    : "starter";

  const timerSecondsRaw = Number(body.timerSeconds);
  const timerSeconds = Number.isFinite(timerSecondsRaw)
    ? Math.max(3, Math.min(300, Math.floor(timerSecondsRaw)))
    : shortlinkType === "starter"
      ? 10
      : shortlinkType === "standard"
        ? 20
        : shortlinkType === "advanced"
          ? 30
          : 45;

  const verificationMethod = ["checkbox", "math"].includes(body.verificationMethod)
    ? body.verificationMethod
    : shortlinkType === "starter"
      ? "checkbox"
      : "math";

  return { shortlinkType, timerSeconds, verificationMethod };
};

const parseScheduleConfig = (body = {}) => {
  const startAfterHoursRaw = Number(body.startAfterHours);
  const durationDaysRaw = Number(body.durationDays);
  const expiryDateTimeRaw = body.expiryDateTime || body.scheduledEndAt || "";

  const startAfterHours = Number.isFinite(startAfterHoursRaw)
    ? Math.max(0, Math.min(24 * 365, Math.floor(startAfterHoursRaw)))
    : 0;
  const durationDays = Number.isFinite(durationDaysRaw)
    ? Math.max(1, Math.min(365, Math.floor(durationDaysRaw)))
    : 1;

  const scheduledStartAt = startAfterHours > 0
    ? new Date(Date.now() + startAfterHours * 60 * 60 * 1000)
    : null;
  const explicitExpiry = expiryDateTimeRaw ? new Date(expiryDateTimeRaw) : null;
  const scheduledEndAt = explicitExpiry && !Number.isNaN(explicitExpiry.getTime())
    ? explicitExpiry
    : scheduledStartAt
      ? new Date(scheduledStartAt.getTime() + durationDays * 24 * 60 * 60 * 1000)
      : null;

  return { startAfterHours, durationDays, expiryDateTime: explicitExpiry?.toISOString?.() || "", scheduledStartAt, scheduledEndAt };
};

router.get("/list", async (req, res) => {
  try {
    const links = await ShortLink.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select(
        "code title reward shortlinkType timerSeconds verificationMethod scheduledStartAt scheduledEndAt isActive"
      )
      .lean();

    return res.json({
      links: links.map((link) => ({
        ...formatForClient(link),
      })),
    });
  } catch (err) {
    console.error("Shortlink list error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/public/:code", async (req, res) => {
  try {
    const code = normalizeCode(req.params.code);
    const link = await ShortLink.findOne({ code, isActive: true }).lean();

    if (!link) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    return res.json({ link: formatForClient(link) });
  } catch (err) {
    console.error("Shortlink details error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/admin/list", async (req, res) => {
  try {
    const links = await ShortLink.find()
      .sort({ createdAt: -1 })
      .select(
        "code title reward externalUrl shortlinkType timerSeconds verificationMethod scheduledStartAt scheduledEndAt topImageUrl topText middleImageUrl middleText extraText actionButtonLabel isActive createdAt"
      )
      .lean();

    return res.json({ links });
  } catch (err) {
    console.error("Shortlink admin list error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/admin", async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    const title = String(req.body.title || "Shortlink").trim();
    const reward = Number(req.body.reward);
    const externalUrl = String(req.body.externalUrl || "").trim();

    if (!code || !Number.isFinite(reward) || reward < 0) {
      return res.status(400).json({
        message: "code and valid reward are required.",
      });
    }

    let normalizedExternalUrl = "";
    if (externalUrl) {
      const validUrl = parseAndValidateUrl(externalUrl);
      if (!validUrl) {
        return res.status(400).json({ message: "externalUrl must be a valid URL." });
      }
      normalizedExternalUrl = validUrl.toString();
    }

    const config = parseShortlinkConfig(req.body);
    const schedule = parseScheduleConfig(req.body);
    const contentConfig = parseContentConfig(req.body);
    if (contentConfig.error) {
      return res.status(400).json({ message: contentConfig.error });
    }

    const created = await ShortLink.create({
      code,
      title,
      reward,
      externalUrl: normalizedExternalUrl,
      shortlinkType: config.shortlinkType,
      timerSeconds: config.timerSeconds,
      verificationMethod: config.verificationMethod,
      scheduledStartAt: schedule.scheduledStartAt,
      scheduledEndAt: schedule.scheduledEndAt,
      topImageUrl: contentConfig.topImageUrl,
      topText: contentConfig.topText,
      middleImageUrl: contentConfig.middleImageUrl,
      middleText: contentConfig.middleText,
      extraText: contentConfig.extraText,
      actionButtonLabel: contentConfig.actionButtonLabel,
      isActive: req.body.isActive !== false,
    });

    return res.status(201).json({ link: formatForClient(created) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This shortlink code already exists." });
    }
    console.error("Shortlink create error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.put("/admin/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shortlink id." });
    }

    const update = {};
    if (req.body.code != null) update.code = normalizeCode(req.body.code);
    if (req.body.title != null) update.title = String(req.body.title || "Shortlink").trim();
    if (req.body.reward != null) {
      const reward = Number(req.body.reward);
      if (!Number.isFinite(reward) || reward < 0) {
        return res.status(400).json({ message: "Valid reward is required." });
      }
      update.reward = reward;
    }
    if (req.body.externalUrl != null) {
      const cleanedExternalUrl = String(req.body.externalUrl || "").trim();
      if (!cleanedExternalUrl) {
        update.externalUrl = "";
      } else {
        const validUrl = parseAndValidateUrl(cleanedExternalUrl);
        if (!validUrl) {
          return res.status(400).json({ message: "externalUrl must be a valid URL." });
        }
        update.externalUrl = validUrl.toString();
      }
    }

    const config = parseShortlinkConfig(req.body);
    const schedule = parseScheduleConfig(req.body);
    const contentConfig = parseContentConfig(req.body);
    if (contentConfig.error) {
      return res.status(400).json({ message: contentConfig.error });
    }
    update.shortlinkType = config.shortlinkType;
    update.timerSeconds = config.timerSeconds;
    update.verificationMethod = config.verificationMethod;
    update.scheduledStartAt = schedule.scheduledStartAt;
    update.scheduledEndAt = schedule.scheduledEndAt;
    update.topImageUrl = contentConfig.topImageUrl;
    update.topText = contentConfig.topText;
    update.middleImageUrl = contentConfig.middleImageUrl;
    update.middleText = contentConfig.middleText;
    update.extraText = contentConfig.extraText;
    update.actionButtonLabel = contentConfig.actionButtonLabel;

    if (req.body.isActive != null) {
      update.isActive = req.body.isActive !== false;
    }

    const updated = await ShortLink.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    return res.json({ link: formatForClient(updated) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This shortlink code already exists." });
    }
    console.error("Shortlink update error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.patch("/admin/:id/toggle", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shortlink id." });
    }

    const link = await ShortLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    link.isActive = !link.isActive;
    await link.save();

    return res.json({ link: formatForClient(link) });
  } catch (err) {
    console.error("Shortlink toggle error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.delete("/admin/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shortlink id." });
    }

    const deleted = await ShortLink.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    return res.json({ success: true, message: "Shortlink deleted." });
  } catch (err) {
    console.error("Shortlink delete error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/start", protectRoute, async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    if (!code) {
      return res.status(400).json({ message: "code is required." });
    }

    const link = await ShortLink.findOne({ code, isActive: true });
    if (!link) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    if (!isShortlinkAvailableNow(link)) {
      return res.status(400).json({
        message: "This shortlink is not active yet or has expired.",
        availabilityStatus: getShortlinkAvailabilityStatus(link),
      });
    }

    const alreadyCompleted = await ShortLinkCompletion.findOne({
      shortLinkId: link._id,
      userId: req.user._id,
    }).lean();

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "You already completed this shortlink.",
        alreadyCompleted: true,
      });
    }

    const visitToken = crypto.randomBytes(24).toString("hex");
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + VISIT_TTL_MS);

    await ShortLinkVisit.create({
      shortLinkId: link._id,
      userId: req.user._id,
      code,
      visitToken,
      startedAt,
      expiresAt,
      status: "started",
    });

    const callbackUrl = `${getFrontendBaseUrl()}/verify?code=${encodeURIComponent(
      code
    )}&v=${visitToken}`;

    const redirectUrl = buildProviderUrl({
      externalUrl: link.externalUrl,
      callbackUrl,
      code,
      visitToken,
    });

    return res.json({
      code,
      title: link.title,
      reward: link.reward,
      callbackUrl,
      redirectUrl,
      visitToken,
    });
  } catch (err) {
    console.error("Shortlink start error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/verify", protectRoute, async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    const visitToken = String(req.body.visitToken || "").trim();

    if (!code || !visitToken) {
      return res.status(400).json({ message: "code and visitToken are required." });
    }

    const link = await ShortLink.findOne({ code, isActive: true });
    if (!link) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    if (!isShortlinkAvailableNow(link)) {
      return res.status(400).json({
        message: "This shortlink is not active yet or has expired.",
        availabilityStatus: getShortlinkAvailabilityStatus(link),
      });
    }

    const alreadyCompleted = await ShortLinkCompletion.findOne({
      shortLinkId: link._id,
      userId: req.user._id,
    }).lean();

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Reward already claimed for this shortlink.",
        alreadyCompleted: true,
      });
    }

    const visit = await ShortLinkVisit.findOne({
      shortLinkId: link._id,
      userId: req.user._id,
      code,
      visitToken,
      status: "started",
    });

    if (!visit) {
      return res.status(400).json({
        message: "Invalid verification request. Start the shortlink again.",
      });
    }

    if (visit.expiresAt && new Date() > visit.expiresAt) {
      visit.status = "expired";
      await visit.save();
      return res.status(400).json({ message: "This verification session expired." });
    }

    if (Date.now() - new Date(visit.startedAt).getTime() < MIN_VERIFY_DELAY_MS) {
      return res.status(400).json({
        message: "Verification arrived too quickly. Please retry after completion.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const reward = Number(link.reward) || 0;

    const completion = await ShortLinkCompletion.create({
      shortLinkId: link._id,
      userId: req.user._id,
      code,
      reward,
      visitToken,
      completedAt: new Date(),
    });

    user.creds = (user.creds || 0) + reward;
    await user.save();

    await Transaction.create({
      userId: req.user._id,
      type: "credit",
      amount: reward,
      description: `Shortlink reward: ${link.title || code}`,
    });

    visit.status = "verified";
    visit.verifiedAt = new Date();
    await visit.save();

    return res.json({
      success: true,
      message: "Shortlink verified. Reward added successfully.",
      reward,
      creds: user.creds,
      completionId: completion._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Reward already claimed for this shortlink.",
        alreadyCompleted: true,
      });
    }
    console.error("Shortlink verify error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/complete-direct", protectRoute, async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    const visitToken = String(req.body.visitToken || "").trim();

    if (!code || !visitToken) {
      return res.status(400).json({ message: "code and visitToken are required." });
    }

    const link = await ShortLink.findOne({ code, isActive: true });
    if (!link) {
      return res.status(404).json({ message: "Shortlink not found." });
    }

    if (!isShortlinkAvailableNow(link)) {
      return res.status(400).json({
        message: "This shortlink is not active yet or has expired.",
        availabilityStatus: getShortlinkAvailabilityStatus(link),
      });
    }

    const alreadyCompleted = await ShortLinkCompletion.findOne({
      shortLinkId: link._id,
      userId: req.user._id,
    }).lean();

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Reward already claimed for this shortlink.",
        alreadyCompleted: true,
      });
    }

    const visit = await ShortLinkVisit.findOne({
      shortLinkId: link._id,
      userId: req.user._id,
      code,
      visitToken,
      status: "started",
    });

    if (!visit) {
      return res.status(400).json({ message: "Invalid session. Please start again." });
    }

    if (visit.expiresAt && new Date() > visit.expiresAt) {
      visit.status = "expired";
      await visit.save();
      return res.status(400).json({ message: "This session expired." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const reward = Number(link.reward) || 0;

    const completion = await ShortLinkCompletion.create({
      shortLinkId: link._id,
      userId: req.user._id,
      code,
      reward,
      visitToken,
      completedAt: new Date(),
    });

    user.creds = (user.creds || 0) + reward;
    await user.save();

    await Transaction.create({
      userId: req.user._id,
      type: "credit",
      amount: reward,
      description: `Shortlink reward: ${link.title || code}`,
    });

    visit.status = "verified";
    visit.verifiedAt = new Date();
    await visit.save();

    return res.json({
      success: true,
      message: "Task completed. Reward added to your creds.",
      reward,
      creds: user.creds,
      completionId: completion._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Reward already claimed for this shortlink.",
        alreadyCompleted: true,
      });
    }
    console.error("Shortlink direct completion error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/my/completions", protectRoute, async (req, res) => {
  try {
    const completions = await ShortLinkCompletion.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .select("code reward completedAt")
      .lean();

    return res.json({ completions });
  } catch (err) {
    console.error("Shortlink completion list error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
