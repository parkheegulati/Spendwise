import transporter from '../config/mail.js';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, body) => {
  if (!process.env.BREVO_USERNAME || !process.env.BREVO_PASSWORD) {
    console.warn('BREVO_USERNAME or BREVO_PASSWORD not configured. Skipping email.');
    return;
  }
  const from = process.env.BREVO_FROM_EMAIL || 'noreply@spendwise.com';
  const isHtml = body.includes('<') && body.includes('>');
  const mailOptions = {
    from,
    to,
    subject,
    [isHtml ? 'html' : 'text']: body
  };
  await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully to ${to}`);
};

export const sendEmailWithAttachment = async (to, subject, body, attachmentBuffer, filename) => {
  if (!process.env.BREVO_USERNAME || !process.env.BREVO_PASSWORD) {
    throw new Error('SMTP email credentials (BREVO_USERNAME/BREVO_PASSWORD) are not configured on the server.');
  }
  const from = process.env.BREVO_FROM_EMAIL || 'noreply@spendwise.com';
  const isHtml = body.includes('<') && body.includes('>');
  const mailOptions = {
    from,
    to,
    subject,
    [isHtml ? 'html' : 'text']: body,
    attachments: [
      {
        filename,
        content: attachmentBuffer
      }
    ]
  };
  await transporter.sendMail(mailOptions);
  console.log(`Email with attachment sent successfully to ${to}`);
};
