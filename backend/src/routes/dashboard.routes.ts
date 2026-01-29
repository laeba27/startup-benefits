import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getDashboardData,
  getUserProfile,
  updateUserProfile,
  getUserClaims,
  getUserStats,
} from '../controllers/dashboard.controller';

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get complete dashboard data for authenticated user
// @access  Private
router.get('/', authenticateToken, getDashboardData);

// @route   GET /api/dashboard/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, getUserProfile);

// @route   PUT /api/dashboard/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, updateUserProfile);

// @route   GET /api/dashboard/claims
// @desc    Get user's claimed deals
// @access  Private
router.get('/claims', authenticateToken, getUserClaims);

// @route   GET /api/dashboard/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticateToken, getUserStats);

export default router;
