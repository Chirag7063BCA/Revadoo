// Backend/routes/contactRoutes.js
const express    = require("express");
const router     = express.Router();
const nodemailer = require("nodemailer");
const multer     = require("multer");

// ── File upload (memory, no disk) ────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ════════════════════════════════════════════════════════
// @route   POST /api/contact
// @access  PUBLIC — no login needed
//
// .env needed:
//   GMAIL_USER         = your sender gmail  (e.g. revadoo.noreply@gmail.com)
//   GMAIL_APP_PASSWORD = 16 char app password
//   SUPPORT_EMAIL      = RevadooXKnydxStudio@gmail.com
// ════════════════════════════════════════════════════════
router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ── Validate ─────────────────────────────────────
    if (!name?.trim())    return res.status(400).json({ message: "Name is required" });
    if (!email?.trim())   return res.status(400).json({ message: "Email is required" });
    if (!message?.trim()) return res.status(400).json({ message: "Message is required" });

    // ── Create transporter ───────────────────────────
    const transporter = nodemailer.createTransport({
      host:   "smtp.gmail.com",
      port:   587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ── Verify connection first ──────────────────────
    await transporter.verify();

    // ── Attachments ──────────────────────────────────
    const attachments = (req.files || []).map((f) => ({
      filename:    f.originalname,
      content:     f.buffer,
      contentType: f.mimetype,
    }));

    // ════════════════════════════
    // EMAIL 1 — to Revadoo inbox
    // ════════════════════════════
    await transporter.sendMail({
      from:    `"REVADOO SUPPORT" <${process.env.GMAIL_USER}>`,
      to:      process.env.SUPPORT_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `📩 New Message from ${name}`,
      attachments,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#ea580c,#f97316);border-radius:10px;padding:20px 24px;margin-bottom:20px;">
            <h2 style="color:#fff;margin:0;font-size:20px;font-weight:900;">REVADOO SUPPORT</h2>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">New support message</p>
          </div>
          <div style="background:#fff;border-radius:10px;padding:20px 24px;margin-bottom:16px;border:1px solid #e5e7eb;">
            <p style="color:#f97316;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">From</p>
            <p style="margin:4px 0;font-size:14px;color:#111;"><strong>Name:</strong> ${name}</p>
            <p style="margin:4px 0;font-size:14px;color:#111;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#f97316;">${email}</a></p>
            <p style="margin:4px 0;font-size:13px;color:#9ca3af;"><strong>Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
          </div>
          <div style="background:#fff;border-radius:10px;padding:20px 24px;border:1px solid #e5e7eb;">
            <p style="color:#f97316;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Message</p>
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          ${attachments.length > 0 ? `
          <div style="background:#fff;border-radius:10px;padding:16px 24px;margin-top:16px;border:1px solid #e5e7eb;">
            <p style="color:#f97316;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">${attachments.length} Attachment(s)</p>
            ${attachments.map(a => `<p style="margin:4px 0;font-size:13px;color:#374151;">📎 ${a.filename}</p>`).join("")}
          </div>` : ""}
          <div style="margin-top:16px;padding:14px 20px;background:#fff7ed;border-radius:10px;border:1px solid #fed7aa;text-align:center;">
            <p style="margin:0;color:#9a3412;font-size:13px;">👆 Hit <strong>Reply</strong> to respond directly to <strong>${name}</strong> at <a href="mailto:${email}" style="color:#f97316;">${email}</a></p>
          </div>
        </div>
      `,
    });

    // ════════════════════════════════════
    // EMAIL 2 — confirmation to the user
    // ════════════════════════════════════
    await transporter.sendMail({
      from:    `"REVADOO SUPPORT" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: `✅ We received your message — REVADOO Support`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#ea580c,#f97316);border-radius:10px;padding:20px 24px;margin-bottom:20px;">
            <h2 style="color:#fff;margin:0;font-size:20px;font-weight:900;">REVADOO SUPPORT</h2>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">Message Received ✅</p>
          </div>
          <div style="background:#fff;border-radius:10px;padding:20px 24px;margin-bottom:16px;border:1px solid #e5e7eb;">
            <p style="font-size:15px;color:#111;margin:0 0 8px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;">
              We have received your message and will get back to you as soon as possible. 
              Here's a copy of what you sent us:
            </p>
          </div>
          <div style="background:#f9f9f9;border-radius:10px;padding:20px 24px;border:1px solid #e5e7eb;border-left:4px solid #f97316;">
            <p style="color:#9ca3af;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Your Message</p>
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <div style="margin-top:20px;padding:14px 20px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;text-align:center;">
            <p style="margin:0;color:#166534;font-size:13px;">We'll reply to this email address: <strong>${email}</strong></p>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">— REVADOO Support Team</p>
        </div>
      `,
    });

    console.log(`✅ Contact email sent: ${name} (${email}) → ${process.env.SUPPORT_EMAIL}`);
    res.status(200).json({ message: "Message sent! Check your email for confirmation." });

  } catch (err) {
    console.error("❌ Contact error:", err.message);
    res.status(500).json({ message: `Failed to send: ${err.message}` });
  }
});

module.exports = router;