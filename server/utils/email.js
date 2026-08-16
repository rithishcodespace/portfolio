const { Resend } = require("resend");
const path = require("path");
const fs = require("fs");

// Lazy-instantiate Resend client instance
let resendInstance = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email Service] RESEND_API_KEY is missing in environment variables.");
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Locate resume PDF on disk
 */
function getResumePdfPath() {
  const possiblePaths = [
    path.join(__dirname, "../../client/public/resumes/Rithish_CV.pdf"),
    path.join(__dirname, "../public/resumes/Rithish_CV.pdf"),
    path.join(process.cwd(), "client/public/resumes/Rithish_CV.pdf"),
    path.join(process.cwd(), "public/resumes/Rithish_CV.pdf"),
    path.join(process.cwd(), "server/public/resumes/Rithish_CV.pdf")
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  console.warn("[Email Service] Resume PDF file not found at searched locations:", possiblePaths);
  return null;
}

/**
 * Send Resume PDF to Visitor's Email via Resend
 */
async function sendResumeToVisitor({ email, fullName }) {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("[Email Service] Skipping sendResumeToVisitor because RESEND_API_KEY is not set.");
      return false;
    }

    const senderName = process.env.SENDER_NAME || "Rithish S";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@rithish.site";
    const fromAddress = `${senderName} <${fromEmail}>`;

    const pdfPath = getResumePdfPath();
    const attachments = [];
    if (pdfPath) {
      const pdfBuffer = fs.readFileSync(pdfPath);
      attachments.push({
        filename: "Rithish_CV.pdf",
        content: pdfBuffer
      });
    }

    const subject = "Rithish S — Resume";
    const text = `Hi ${fullName},\n\nThank you for your interest in my profile.\n\nAs requested, I have attached my resume for your reference.\n\nBest regards,\nRithish S\nComputer Science & Engineering Student\nPortfolio: https://portfolio.rithish.site`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-top: 0;">Hi ${fullName},</h2>
        <p>Thank you for your interest in my profile.</p>
        <p>As requested, I have attached my resume for your reference.</p>
        <p>I am actively looking for software engineering and backend development opportunities. Feel free to reply directly to this email if you'd like to discuss potential roles.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="margin: 0; font-weight: bold; color: #0f172a;">Rithish S</p>
        <p style="margin: 4px 0; color: #64748b; font-size: 14px;">Backend Engineer & Computer Science Student</p>
        <p style="margin: 4px 0; font-size: 14px;"><a href="https://portfolio.rithish.site" style="color: #0284c7; text-decoration: none;">portfolio.rithish.site</a></p>
      </div>
    `;

    const response = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject,
      text,
      html,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    if (response.error) {
      console.error("[Email Service Error] Failed to send resume to visitor:", response.error.message || response.error);
      return false;
    }

    console.log(`[Email Service] Resume sent to ${email} via Resend. ID:`, response.data?.id || "success");
    return true;
  } catch (error) {
    console.error("[Email Service Error] Failed to send resume to visitor:", error.message || error);
    return false;
  }
}

/**
 * Send Notification Email to Owner via Resend
 */
async function sendNotificationToOwner(data) {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("[Email Service] Skipping sendNotificationToOwner because RESEND_API_KEY is not set.");
      return false;
    }

    const senderName = process.env.SENDER_NAME || "Rithish S";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@rithish.site";
    const fromAddress = `${senderName} <${fromEmail}>`;
    const ownerEmail = process.env.NOTIFICATION_EMAIL || "rithishcodespace@gmail.com";

    const requestedAtStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const subject = `New Resume Request — ${data.fullName}`;
    const text = `New Resume Request\n\nName: ${data.fullName}\nEmail: ${data.email}\nCompany: ${data.company}\nRole: ${data.role || 'N/A'}\nReason: ${data.reason || 'N/A'}\nLinkedIn: ${data.linkedin || 'N/A'}\nRequested at: ${requestedAtStr}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
        <h2 style="color: #0f172a; margin-top: 0;">📄 New Resume Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Name:</td><td style="padding: 8px;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Work Email:</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Company:</td><td style="padding: 8px;">${data.company}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Role / Position:</td><td style="padding: 8px;">${data.role || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Reason:</td><td style="padding: 8px;">${data.reason || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">LinkedIn:</td><td style="padding: 8px;">${data.linkedin ? `<a href="${data.linkedin}">${data.linkedin}</a>` : 'N/A'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Requested at:</td><td style="padding: 8px;">${requestedAtStr}</td></tr>
        </table>
      </div>
    `;

    const response = await resend.emails.send({
      from: fromAddress,
      to: [ownerEmail],
      subject,
      text,
      html
    });

    if (response.error) {
      console.error("[Email Service Error] Failed to send notification to owner:", response.error.message || response.error);
      return false;
    }

    console.log(`[Email Service] Owner notification sent to ${ownerEmail} via Resend. ID:`, response.data?.id || "success");
    return true;
  } catch (error) {
    console.error("[Email Service Error] Failed to send notification to owner:", error.message || error);
    return false;
  }
}

module.exports = {
  sendResumeToVisitor,
  sendNotificationToOwner,
  getResendClient
};
