import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  isVerified: boolean;
  adminVerified: boolean;
  profile?: {
    name?: string;
    phone?: string;
    company?: string;
    role?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    adminVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      name: {
        type: String,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
      },
      phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot be more than 20 characters'],
      },
      company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot be more than 100 characters'],
      },
      role: {
        type: String,
        trim: true,
        maxlength: [50, 'Role cannot be more than 50 characters'],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot be more than 200 characters'],
      },
      city: {
        type: String,
        trim: true,
        maxlength: [50, 'City cannot be more than 50 characters'],
      },
      state: {
        type: String,
        trim: true,
        maxlength: [50, 'State cannot be more than 50 characters'],
      },
      zipCode: {
        type: String,
        trim: true,
        maxlength: [20, 'Zip code cannot be more than 20 characters'],
      },
      country: {
        type: String,
        trim: true,
        maxlength: [50, 'Country cannot be more than 50 characters'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Additional indexes
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);