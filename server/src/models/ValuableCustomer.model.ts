// ============================================================================
// ElectroKart / Scientific Wala — Valuable Customer Model
// ============================================================================
// Stores institutions, universities, and enterprise research clients
// for social proof banners. Supports logo uploads, ordering, and activation toggles.
// ============================================================================

import mongoose, { Schema, Document } from 'mongoose';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IValuableCustomer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  logo: {
    url: string;
    publicId?: string;
  };
  website?: string;
  description?: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const valuableCustomerSchema = new Schema<IValuableCustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer/Institution name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    logo: {
      url: {
        type: String,
        required: [true, 'Logo image URL is required'],
      },
      publicId: {
        type: String,
      },
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
    },
    position: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

valuableCustomerSchema.index({ isActive: 1, position: 1 });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const ValuableCustomer = mongoose.model<IValuableCustomer>('ValuableCustomer', valuableCustomerSchema);

export default ValuableCustomer;
