// ============================================================================
// ElectroKart / Scientific Wala — Valuable Customer Validators
// ============================================================================
// Defines input validation schemas for valuable customers / partner institutions.
// ============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Sub-document Schemas
// ---------------------------------------------------------------------------

const valuableCustomerLogoSchema = z.object({
  url: z.string({ required_error: 'Logo image URL is required' }).url('Logo must be a valid URL'),
  publicId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Base Schema
// ---------------------------------------------------------------------------

export const createValuableCustomerSchema = z.object({
  name: z
    .string({ required_error: 'Customer name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must not exceed 120 characters'),

  logo: valuableCustomerLogoSchema,

  website: z
    .string()
    .trim()
    .url('Website must be a valid URL')
    .optional()
    .or(z.literal('')),

  description: z
    .string()
    .trim()
    .max(250, 'Description must not exceed 250 characters')
    .optional()
    .or(z.literal('')),

  position: z
    .number()
    .int()
    .min(0, 'Position must be 0 or greater')
    .optional()
    .default(0),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const updateValuableCustomerSchema = createValuableCustomerSchema.partial();

export default {
  createValuableCustomerSchema,
  updateValuableCustomerSchema,
};
