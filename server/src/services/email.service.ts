import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  token: string,
): Promise<void> {
  const verifyUrl = `${env.SERVER_URL}/api/auth/verify-email/${token}`;
  console.log(`📧 Sending verification email to ${to}...`);

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Please verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a2e;">Hi ${firstName},</h2>
        <p style="color: #444; font-size: 16px; line-height: 1.5;">
          Thank you for signing up! Please confirm that this is your email address by clicking the button below.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}"
            style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none;
                   border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          This link will expire in 24 hours. If you did not sign up, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #aaa; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verifyUrl}" style="color: #6366f1;">${verifyUrl}</a>
        </p>
      </div>
    `,
  });
  console.log(`✅ Verification email sent to ${to}`);
}
