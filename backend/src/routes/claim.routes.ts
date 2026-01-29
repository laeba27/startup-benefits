import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { claimDeal, getUserClaims } from '../controllers/claim.controller';

const router = express.Router();

// @route   GET /api/claims/my
// @desc    Get user's claimed deals
// @access  Private
router.get('/my', authenticateToken, getUserClaims);

// @route   POST /api/claims
// @desc    Claim a deal
// @access  Private
router.post('/', authenticateToken, claimDeal);

export default router;