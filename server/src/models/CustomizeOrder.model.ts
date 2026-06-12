// ============================================================================
// Scientific Wala — CustomizeOrder Model
// ============================================================================
// Stores customer product customization requests.
// ============================================================================

import mongoose, { Schema, Document } from 'mongoose';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface ICustomizeOrder extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName: string;
  productId: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const customizeOrderSchema = new Schema<ICustomizeOrder>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    productName: {
      type: String,
      required: [true, 'Product Name is required'],
      trim: true,
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true,
    },
  },
  {
    collection: 'customize_orders',
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const CustomizeOrder = mongoose.model<ICustomizeOrder>('CustomizeOrder', customizeOrderSchema);

export default CustomizeOrder;
