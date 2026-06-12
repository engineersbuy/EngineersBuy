// ============================================================================
// Scientific Wala — CustomizeOrder Controller
// ============================================================================
// Validates inputs, saves customization request to MongoDB, and triggers SMTP notification.
// ============================================================================

import { Request, Response } from 'express';
import { CustomizeOrder } from '../models/index.js';
import { EmailService } from '../services/index.js';
import { ApiResponse, asyncHandler } from '../utils/index.js';

/**
 * Handle POST customization order requests.
 */
export const createCustomizeOrder = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message, productName, productId } = req.body;

  // Basic validation of fields
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400);
    throw new Error('Name is required');
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400);
    throw new Error('Email is required');
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    res.status(400);
    throw new Error('Phone number is required');
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400);
    throw new Error('Message is required');
  }

  if (!productName || typeof productName !== 'string' || !productName.trim()) {
    res.status(400);
    throw new Error('Product Name is required');
  }

  if (!productId || typeof productId !== 'string' || !productId.trim()) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Save customize order request to MongoDB customize_orders collection
  const newRequest = await CustomizeOrder.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    message: message.trim(),
    productName: productName.trim(),
    productId: productId.trim(),
  });

  // Trigger admin email notification asynchronously in the background (prevent blocking response)
  EmailService.sendCustomizeOrderEmail({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    productName: productName.trim(),
    productId: productId.trim(),
    message: message.trim(),
  }).catch((error) => {
    console.error('Email notification background job failed:', error);
  });

  res.status(201).json(
    new ApiResponse(
      201,
      newRequest,
      'Your order customization request has been submitted successfully.'
    )
  );
});
