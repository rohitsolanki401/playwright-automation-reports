/**
 * Sends email with the latest test report link after deployment.
 * Uses .env: EMAIL_USER, EMAIL_PASS, EMAIL_TO
 * REPORT_URL can be passed as env var or first CLI arg.
 */
import "dotenv/config";
import nodemailer from "nodemailer";

const reportUrl = process.env.REPORT_URL || process.argv[2];

if (!reportUrl) {
  console.warn("⚠ No REPORT_URL provided. Skipping email.");
  process.exit(0);
}

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO || process.env.EMAIL_USER;

if (!emailUser || !emailPass) {
  console.warn("⚠ EMAIL_USER or EMAIL_PASS not set in .env. Skipping email.");
  process.exit(0);
}

const customMessage = process.env.REPORT_EMAIL_MESSAGE || "Automation execution has been completed successfully. Please find the latest test report below.";

const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Hi Sir,</p>
  
  <p>${customMessage}</p>
  
  <p>Please click the link below to view the detailed report:</p>
  
  <p>
    <a href="${reportUrl}" 
       style="display: inline-block; padding: 12px 24px; background-color: #238636; color: white; 
              text-decoration: none; border-radius: 6px; font-weight: 500;">
      View Latest Test Report
    </a>
  </p>
  
  <p style="color: #666; font-size: 14px;">
    <strong>Report URL:</strong> <a href="${reportUrl}">${reportUrl}</a>
  </p>
  
  <br>
  <p>Thanks,<br>Automation Team</p>
</body>
</html>
`;

async function send() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass },
  });

  await transporter.sendMail({
    from: emailUser,
    to: emailTo,
    subject: "Playwright Automation Report – Latest Test Run",
    html,
  });

  console.log("📧 Email sent successfully to", emailTo);
}

send().catch((err) => {
  console.error("❌ Email failed:", err.message);
  process.exit(1);
});
