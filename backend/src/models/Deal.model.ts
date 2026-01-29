import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  value: number;
  discount: number;
  company: string;
  logo: string;
  link: string;
  couponCode?: string;
  isLocked: boolean;
  eligibilityText?: string;
  expirationDate: Date;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        'devtools',
        'analytics',
        'design',
        'marketing',
        'productivity',
        'cloud',
        'security',
        'database',
        'devops',
        'other'
      ],
      default: 'other',
    },

    value: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 100,
    },

    company: {
      type: String,
      required: true,
    },

    logo: String,

    link: {
      type: String,
      required: true,
    },

    couponCode: String,

    isLocked: {
      type: Boolean,
      default: false,
    },

    eligibilityText: String,

    expirationDate: {
      type: Date,
      required: true,
    },

    requirements: [String],

    benefits: [String],

    tags: [String],

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Deal = mongoose.model<IDeal>('Deal', dealSchema);
