import transporter from '../config/mail.js';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, body) => {
  try {
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
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

export const sendEmailWithAttachment = async (to, subject, body, attachmentBuffer, filename) => {
  try {
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
  } catch (error) {
    console.error(`Failed to send email with attachment to ${to}:`, error.message);
  }
};
