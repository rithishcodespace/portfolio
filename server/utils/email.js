const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

/**
 * Get or create Nodemailer transporter
 */
async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    // If using Gmail, use Nodemailer's built-in 'gmail' service to bypass cloud provider port 587 blocking
    if ((host && host.includes("gmail")) || (user && user.endsWith("@gmail.com"))) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });
    }

    if (host) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });
    }
  }

  // Fallback for local development or missing SMTP credentials
  console.log("[Email Service] No production SMTP configured. Using Ethereal / mock transporter.");
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    // If ethereal fails, return a stream transport for debugging
    return nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true
    });
  }
}

/**
 * Send Resume PDF to Visitor's Email
 */
async function sendResumeToVisitor({ email, fullName }) {
  try {
    const transporter = await getTransporter();

    // Locate PDF file
    const possiblePaths = [
      path.join(__dirname, "../../client/public/resumes/Rithish_CV.pdf"),
      path.join(__dirname, "../public/resumes/Rithish_CV.pdf"),
      path.join(process.cwd(), "client/public/resumes/Rithish_CV.pdf")
    ];

    let pdfPath = possiblePaths.find((p) => fs.existsSync(p));

    const attachments = [];
    if (pdfPath) {
      attachments.push({
        filename: "Rithish_S_Resume.pdf",
        path: pdfPath,
        contentType: "application/pdf"
      });
    } else {
      console.warn("[Email Service] Resume PDF file not found on disk at paths:", possiblePaths);
    }

    const mailOptions = {
      from: `"${process.env.SENDER_NAME || 'Rithish S'}" <${process.env.SMTP_USER || 'no-reply@rithish.site'}>`,
      to: email,
      subject: "Rithish S — Resume",
      text: `Hi ${fullName},\n\nThank you for reaching out through my portfolio website!\n\nI have attached my latest resume to this email. Please feel free to reply directly if you'd like to discuss any internship or software engineering opportunities.\n\nBest regards,\nRithish S\nComputer Science & Engineering Student\nPortfolio: https://portfolio.rithish.site`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">Hi ${fullName},</h2>
          <p>Thank you for reaching out through my developer portfolio!</p>
          <p>As requested, I have attached my latest resume to this email for your review.</p>
          <p>I am actively looking for software engineering and backend development opportunities. If you have any questions or would like to schedule a conversation, please feel free to reply directly to this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="margin: 0; font-weight: bold; color: #0f172a;">Rithish S</p>
          <p style="margin: 4px 0; color: #64748b; font-size: 14px;">Backend Engineer & Computer Science Student</p>
          <p style="margin: 4px 0; font-size: 14px;"><a href="https://portfolio.rithish.site" style="color: #0284c7; text-decoration: none;">portfolio.rithish.site</a></p>
        </div>
      `,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Resume email sent to ${email}. MessageId:`, info.messageId || "sent");
    return true;
  } catch (error) {
    console.error("[Email Service Error] Failed to send resume to visitor:", error);
    // Don't fail the request if email sending encounters a non-fatal error
    return false;
  }
}

/**
 * Send Notification Email to Owner
 */
async function sendNotificationToOwner(data) {
  try {
    const ownerEmail = process.env.NOTIFICATION_EMAIL || process.env.OWNER_EMAIL || "rithishcodespace@gmail.com";
    const transporter = await getTransporter();

    const mailOptions = {
      from: `"${process.env.SENDER_NAME || 'Portfolio System'}" <${process.env.SMTP_USER || 'no-reply@rithish.site'}>`,
      to: ownerEmail,
      subject: `New Resume Request: ${data.fullName} (${data.company})`,
      text: `New Resume Request\n\nName: ${data.fullName}\nEmail: ${data.email}\nCompany: ${data.company}\nRole: ${data.role || 'N/A'}\nReason: ${data.reason || 'N/A'}\nLinkedIn: ${data.linkedin || 'N/A'}\nRequested at: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
          <h2 style="color: #0f172a; margin-top: 0;">📄 New Resume Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Name:</td><td style="padding: 8px;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Work Email:</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Company:</td><td style="padding: 8px;">${data.company}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Role / Position:</td><td style="padding: 8px;">${data.role || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Reason:</td><td style="padding: 8px;">${data.reason || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">LinkedIn:</td><td style="padding: 8px;">${data.linkedin ? `<a href="${data.linkedin}">${data.linkedin}</a>` : 'N/A'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Requested at:</td><td style="padding: 8px;">${new Date().toLocaleString()}</td></tr>
          </table>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Owner notification sent to ${ownerEmail}. MessageId:`, info.messageId || "sent");
    return true;
  } catch (error) {
    console.error("[Email Service Error] Failed to send notification to owner:", error);
    return false;
  }
}

module.exports = {
  sendResumeToVisitor,
  sendNotificationToOwner
};
