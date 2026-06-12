// ============================================================================
// Scientific Wala — Nodemailer Email Service
// ============================================================================
// Sends product customization request notifications to the administrator.
// ============================================================================

import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/index.js';

/**
 * Sends a customization request email notification to the admin.
 */
export async function sendCustomizeOrderEmail(data: {
  name: string;
  email: string;
  phone: string;
  productName: string;
  productId: string;
  message: string;
}): Promise<boolean> {
  const emailUser = env.EMAIL_USER;
  const emailPass = env.EMAIL_PASS;
  const adminEmail = env.ADMIN_EMAIL;

  if (!emailUser || !emailPass || !adminEmail) {
    logger.warn(
      '⚠️ Nodemailer is not fully configured (EMAIL_USER, EMAIL_PASS, or ADMIN_EMAIL is missing). Email notification skipped.'
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Standard fallback service
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"Scientific Wala Notifications" <${emailUser}>`,
      to: adminEmail,
      subject: 'New Product Customization Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a9e82; border-bottom: 2px solid #1a9e82; padding-bottom: 10px;">New Customization Request</h2>
          <p style="font-size: 16px;">A user has requested order customization for a product:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px; border-bottom: 1px solid #eee;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Product Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.productName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Product ID:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><code>${data.productId}</code></td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; bg-color: #f9f9f9; border-left: 4px solid #1a9e82; background: #f9f9f9;">
            <p style="margin: 0; font-weight: bold; margin-bottom: 8px;">Message / Customization Details:</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.5; color: #555;">${data.message}</p>
          </div>

          <hr style="border: 0; border-top: 1px solid #eeeeee; margin-top: 25px;" />
          <p style="font-size: 11px; color: #888; text-align: center;">This is an automated notification from Scientific Wala.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`📧 Notification email sent to admin (${adminEmail}) for product customization request of ${data.productName}`);
    return true;
  } catch (error) {
    logger.error(`❌ Failed to send nodemailer notification email:`, error);
    return false;
  }
}
