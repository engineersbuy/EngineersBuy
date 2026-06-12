// ============================================================================
// ElectroKart — Email Service
// ============================================================================
// Manages sending structured transactional emails using the Resend client.
// Supports custom HTML templating for welcome, password resets, and orders.
// ============================================================================

import { resend } from '../config/resend.js';
import { env } from '../config/env.js';
import { logger } from '../utils/index.js';

export class EmailService {
  /**
   * General-purpose email sender.
   */
  private static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await resend.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      if (response.error) {
        logger.error(`❌ Resend Email Error: ${response.error.message}`, response.error);
        return false;
      }

      logger.info(`📧 Transactional email sent successfully to: ${to} (Subject: "${subject}")`);
      return true;
    } catch (error) {
      logger.error(`❌ Failed to send transactional email to ${to}:`, error);
      return false;
    }
  }

  /**
   * Sends a welcome email upon user registration.
   */
  public static async sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
    const subject = 'Welcome to ElectroKart! ⚡';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Welcome to ElectroKart!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for creating an account with ElectroKart. We are thrilled to have you as part of our community of engineering students and makers!</p>
        <p>ElectroKart provides startup-ready electronics components, development boards (Arduino, ESP32, Raspberry Pi), robotics kits, drone electronics, and engineering tools at students-friendly prices.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${env.CLIENT_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Start Exploring Catalog</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee;" />
        <p style="font-size: 12px; color: #777777; text-align: center;">This is an automated transactional email from ElectroKart. Please do not reply directly.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  /**
   * Sends a password reset instruction email.
   */
  public static async sendPasswordResetEmail(to: string, firstName: string, resetUrl: string): Promise<boolean> {
    const subject = 'ElectroKart — Reset Your Password 🔑';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #dc2626; text-align: center;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password for your ElectroKart account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
        <p>If you did not make this request, you can safely ignore this email — your password will remain secure.</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee;" />
        <p style="font-size: 12px; color: #777777; text-align: center;">This is an automated transactional email from ElectroKart.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  /**
   * Sends an order placement confirmation email.
   */
  public static async sendOrderConfirmationEmail(to: string, firstName: string, orderId: string, totalPrice: number): Promise<boolean> {
    const subject = `Order Confirmed: ${orderId} 📦`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #10b981; text-align: center;">Order Confirmed!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for shopping at ElectroKart! Your order <strong>${orderId}</strong> has been successfully placed.</p>
        <p>We are preparing your components for shipping. You will receive a tracking link as soon as your order has been dispatched.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">Order Summary</h4>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${totalPrice.toFixed(2)}</p>
        </div>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${env.CLIENT_URL}/profile/orders" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Order History</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee;" />
        <p style="font-size: 12px; color: #777777; text-align: center;">This is an automated transactional email from ElectroKart.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  /**
   * Sends a customization request email notification to the admin using Resend.
   */
  public static async sendCustomizeOrderEmail(data: {
    name: string;
    email: string;
    phone: string;
    productName: string;
    productId: string;
    message: string;
  }): Promise<boolean> {
    const subject = 'New Product Customization Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a9e82; border-bottom: 2px solid #1a9e82; padding-bottom: 10px; margin-top: 0;">New Customization Request</h2>
        <p style="font-size: 15px;">A user has requested order customization for a product:</p>
        
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

        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #1a9e82; background: #f9f9f9; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; margin-bottom: 8px;">Message / Customization Details:</p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.5; color: #555;">${data.message}</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #eeeeee; margin-top: 25px;" />
        <p style="font-size: 11px; color: #888; text-align: center;">This is an automated notification from Scientific Wala.</p>
      </div>
    `;

    const adminEmail = env.ADMIN_EMAIL || 'engineersbuy@gmail.com';
    return this.sendEmail(adminEmail, subject, html);
  }
}

export default EmailService;
