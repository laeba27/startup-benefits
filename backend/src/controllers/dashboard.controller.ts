import { Request, Response } from 'express';
import User from '../models/User.model';
import { Deal } from '../models/Deal.model';
import { Claim } from '../models/Claim.model';
import mongoose from 'mongoose';

// Extend Express Request to include user info
interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

// Get dashboard data for authenticated user
export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get user profile
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's claimed deals
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const userClaims = await Claim.find({ userId }).populate('dealId');
    
    // Calculate stats
    const totalClaimsClaimed = userClaims.length;
    const approvedClaims = userClaims.filter(c => c.status === 'approved');
    const pendingClaims = userClaims.filter(c => c.status === 'pending');
    
    // Calculate total savings from approved claims
    const totalSavings = approvedClaims.reduce((sum, claim) => {
      const dealValue = (claim.dealId as any)?.value || 0;
      return sum + dealValue;
    }, 0);
    
    // Active deals = approved claims
    const activeDeals = approvedClaims.length;
    const pendingClaimsCount = pendingClaims.length;

    // Get deals statistics
    const totalDeals = await Deal.countDocuments();
    const publicDeals = await Deal.countDocuments({ isRestricted: false });
    const restrictedDeals = await Deal.countDocuments({ isRestricted: true });

    // Calculate total value of all deals
    const dealsValue = await Deal.aggregate([
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        profile: {
          _id: user._id,
          name: user.profile?.name || null,
          email: user.email,
          phone: user.profile?.phone || null,
          company: user.profile?.company || null,
          role: user.profile?.role || null,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        stats: {
          totalClaimsClaimed: totalClaimsClaimed,
          activeDeals: activeDeals,
          pendingClaims: pendingClaimsCount,
          totalSavings: totalSavings,
          availableDeals: totalDeals,
          publicDeals: publicDeals,
          restrictedDeals: restrictedDeals,
          totalValue: dealsValue[0]?.total || 0,
        },
        claims: userClaims,
        recentActivity: [],
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user profile for dashboard
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        _id: user._id,
        name: user.profile?.name || null,
        email: user.email,
        phone: user.profile?.phone || null,
        company: user.profile?.company || null,
        role: user.profile?.role || null,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { name, phone, company, role } = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profile: {
          name: name.trim(),
          phone: phone?.trim() || undefined,
          company: company?.trim() || undefined,
          role: role?.trim() || undefined,
        },
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.profile?.name || null,
        email: user.email,
        phone: user.profile?.phone || null,
        company: user.profile?.company || null,
        role: user.profile?.role || null,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user claims (placeholder for future implementation)
export const getUserClaims = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // This will be implemented when Claim model is created
    const claims: any[] = [];

    res.status(200).json({
      success: true,
      message: 'User claims retrieved successfully',
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    console.error('Error fetching user claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user claims',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get total deals available
    const totalDeals = await Deal.countDocuments();
    const publicDeals = await Deal.countDocuments({ isRestricted: false });

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: {
        totalClaimsClaimed: 0,
        activeDeals: 0,
        pendingClaims: 0,
        totalSavings: 0,
        availableDeals: totalDeals,
        publicDeals: publicDeals,
      },
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
