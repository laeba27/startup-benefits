import mongoose, { Schema, Document } from "mongoose";

export interface IClaim extends Document {
  userId: mongoose.Types.ObjectId;
  dealId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  claimedAt: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    dealId: {
      type: Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    claimedAt: {
      type: Date,
      default: Date.now,
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);


claimSchema.index({ userId: 1, dealId: 1 }, { unique: true });

export const Claim = mongoose.model<IClaim>("Claim", claimSchema);
