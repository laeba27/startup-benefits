import { Request, Response, NextFunction } from 'express';
import { Claim, IClaim } from '../models/Claim.model';
import { Deal } from '../models/Deal.model';
import mongoose from 'mongoose';

// Extend Express Request to include user from JWT
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * @route   POST /api/claims
 * @desc    Claim a deal
 * @access  Private
 */
export const claimDeal = async (req: Request, res: Response) => {
  try {
    const { dealId } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID not found',
      });
    }

    if (!dealId) {
      return res.status(400).json({
        success: false,
        message: 'Deal ID is required',
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deal ID format',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    // Check if deal exists
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    // Check if user already claimed this deal
    const existingClaim = await Claim.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      dealId: new mongoose.Types.ObjectId(dealId),
    });

    if (existingClaim) {
      return res.status(409).json({
        success: false,
        message: 'You have already claimed this deal',
        data: {
          claim: existingClaim,
        },
      });
    }

    // Create new claim
    const newClaim = new Claim({
      userId: new mongoose.Types.ObjectId(userId),
      dealId: new mongoose.Types.ObjectId(dealId),
      status: 'pending',
      claimedAt: new Date(),
    });

    const savedClaim = await newClaim.save();

    // Populate references for response
    const populatedClaim = await Claim.findById(savedClaim._id)
      .populate('userId', 'email profile')
      .populate('dealId', 'title slug category');

    return res.status(201).json({
      success: true,
      message: 'Deal claimed successfully',
      data: {
        claim: populatedClaim,
      },
    });
  } catch (error: any) {
    console.error('Error claiming deal:', error);

    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already claimed this deal',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error claiming deal',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/claims/my
 * @desc    Get user's claimed deals
 * @access  Private
 */
export const getUserClaims = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID not found',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const claims = await Claim.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate('dealId', 'title slug category description discount value company')
      .populate('userId', 'email profile')
      .sort({ claimedAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'User claims retrieved successfully',
      data: {
        claims,
        total: claims.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user claims:', error);

    return res.status(500).json({
      success: false,
      message: 'Error fetching claims',
      error: error.message,
    });
  }
};
