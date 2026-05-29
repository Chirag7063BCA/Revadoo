// utils/emailService.js
const nodemailer = require("nodemailer");

const emailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
const emailPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

const baseTemplate = (content) => `
  <div style="font-family:'DM Sans',Arial,sans-serif;max-width:560px;
    margin:0 auto;background:#fff;border:1px solid #e8e8e8;border-radius:12px;
    overflow:hidden;">
    <div style="background:#FF6B35;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">
        RevaEarn Wallet
      </h1>
    </div>
    <div style="padding:32px;">
      ${content}
    </div>
    <div style="padding:16px 32px;background:#f9f9f9;
      border-top:1px solid #e8e8e8;text-align:center;">
      <p style="color:#aaa;font-size:12px;margin:0;">
        You received this because you have an account on RevaEarn.
        <br/>If this wasn't you, contact support immediately.
      </p>
    </div>
  </div>
`;

const sendEmail = async (emailOrOptions, subject, html) => {
  const options =
    typeof emailOrOptions === "object" && emailOrOptions !== null
      ? emailOrOptions
      : { email: emailOrOptions, subject, html };

  try {
    if (!emailUser || !emailPass) {
      console.warn("Email configuration missing in .env — skipping email send");
      return;
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"RevaEarn Wallet" <${emailUser}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

const sendConversionEmail = async (user, { credsConverted, newWalletBalance }) => {
  const html = baseTemplate(`
    <h2 style="color:#0a0a0a;font-size:18px;margin:0 0 16px;">
      ✅ Creds Converted Successfully
    </h2>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      Your <strong>${credsConverted} Creds</strong> have been converted to 
      real cash and added to your wallet.
    </p>
    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#888;">Creds Converted</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#FF6B35;">
        ${credsConverted} Creds
      </p>
      <p style="margin:16px 0 0;font-size:13px;color:#888;">New Wallet Balance</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0a0a0a;">
        ₹${newWalletBalance.toFixed(2)}
      </p>
    </div>
    <p style="color:#aaa;font-size:12px;">
      Date: ${new Date().toLocaleString("en-IN")}
    </p>
    <p style="color:#aaa;font-size:12px;">
      Not you? Contact support immediately.
    </p>
  `);
  await sendEmail(user.email, "✅ Creds Converted — Wallet Updated", html);
};

const sendWithdrawalRequestEmail = async (
  user,
  { amount, method, referenceId, accountDisplay }
) => {
  const html = baseTemplate(`
    <h2 style="color:#0a0a0a;font-size:18px;margin:0 0 16px;">
      💸 Withdrawal Request Received
    </h2>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      We have received your withdrawal request. 
      Funds will be processed within 2–3 business days.
    </p>
    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:20px 0;">
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr>
          <td style="color:#888;padding:6px 0;">Amount</td>
          <td style="font-weight:700;color:#0a0a0a;text-align:right;">₹${amount}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:6px 0;">Method</td>
          <td style="font-weight:700;color:#0a0a0a;text-align:right;">${method}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:6px 0;">To</td>
          <td style="font-weight:700;color:#0a0a0a;text-align:right;">${accountDisplay}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:6px 0;">Reference ID</td>
          <td style="font-weight:700;color:#FF6B35;text-align:right;font-family:monospace;">
            ${referenceId}
          </td>
        </tr>
      </table>
    </div>
    <p style="color:#aaa;font-size:12px;">
      Date: ${new Date().toLocaleString("en-IN")}
    </p>
  `);
  await sendEmail(user.email, `💸 Withdrawal Request — ₹${amount} Processing`, html);
};

const sendWithdrawalCompletedEmail = async (user, { amount, referenceId, method, accountDisplay }) => {
  const html = baseTemplate(`
    <h2 style="color:#0a0a0a;font-size:18px;margin:0 0 16px;">
      🧾 Bank Statement Update
    </h2>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      This amount has been credited from your Real Money Wallet to your bank account.
    </p>
    <div style="background:#f9f9f9;border:1px solid #ececec;
      border-radius:8px;padding:16px;margin:20px 0;">
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr>
          <td style="color:#888;padding:6px 0;">Transaction Type</td>
          <td style="font-weight:700;color:#0a0a0a;text-align:right;">${method || "Bank Transfer"}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:6px 0;">Amount Credited</td>
          <td style="font-weight:700;color:#16a34a;text-align:right;">₹${amount}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:6px 0;">Destination</td>
          <td style="font-weight:700;color:#0a0a0a;text-align:right;">${accountDisplay || "Your bank account"}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:6px 0;">Reference ID</td>
          <td style="font-weight:700;color:#FF6B35;text-align:right;font-family:monospace;">${referenceId}</td>
        </tr>
      </table>
    </div>
    <p style="color:#aaa;font-size:12px;">
      Date: ${new Date().toLocaleString("en-IN")}
    </p>
  `);
  await sendEmail(user.email, `🧾 ₹${amount} Credited to Bank Account`, html);
};

const sendWithdrawalFailedEmail = async (user, { amount, reason }) => {
  const html = baseTemplate(`
    <h2 style="color:#0a0a0a;font-size:18px;margin:0 0 16px;">
      ❌ Withdrawal Failed — Amount Refunded
    </h2>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      Your withdrawal of ₹${amount} could not be processed. 
      The amount has been refunded to your wallet.
    </p>
    <div style="background:#fef2f2;border:1px solid #fecaca;
      border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#dc2626;">
        Reason: ${reason}
      </p>
    </div>
    <p style="color:#555;font-size:14px;">
      Please contact support if you need help.
    </p>
  `);
  await sendEmail(user.email, `❌ Withdrawal Failed — ₹${amount} Refunded`, html);
};

const sendSecurityAlertEmail = async (user, { action, ipAddress }) => {
  const html = baseTemplate(`
    <h2 style="color:#0a0a0a;font-size:18px;margin:0 0 16px;">
      🔐 Security Alert
    </h2>
    <p style="color:#555;font-size:14px;line-height:1.6;">
      A security-sensitive action was performed on your account.
    </p>
    <div style="background:#fffbeb;border:1px solid #fde68a;
      border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        Action: <strong>${action}</strong><br/>
        IP Address: ${ipAddress}<br/>
        Time: ${new Date().toLocaleString("en-IN")}
      </p>
    </div>
    <p style="color:#dc2626;font-size:13px;font-weight:600;">
      If this wasn't you, contact support immediately and change your PIN.
    </p>
  `);
  await sendEmail(user.email, `🔐 Security Alert — ${action}`, html);
};

module.exports = {
  sendEmail,
  sendConversionEmail,
  sendWithdrawalRequestEmail,
  sendWithdrawalCompletedEmail,
  sendWithdrawalFailedEmail,
  sendSecurityAlertEmail,
};