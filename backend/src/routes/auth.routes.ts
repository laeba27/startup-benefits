import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  register,
  sendMagicLink,
  verifyMagicLink,
  refreshToken,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/auth.controller';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user with profile data and send verification email
// @access  Public
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('phone')
      .optional()
      .trim(),
    body('company')
      .optional()
      .trim(),
    body('role')
      .optional()
      .trim(),
  ],
  validateRequest,
  register
);

// @route   POST /api/auth/magic-link
// @desc    Send magic link for passwordless authentication
// @access  Public
router.post(
  '/magic-link',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],
  validateRequest,
  sendMagicLink
);

// @route   POST /api/auth/verify
// @desc    Verify magic link token and authenticate user
// @access  Public
router.post(
  '/verify',
  [
    body('token')
      .notEmpty()
      .withMessage('Token is required'),
  ],
  validateRequest,
  verifyMagicLink
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post(
  '/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  validateRequest,
  refreshToken
);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @route   PATCH /api/auth/profile
// @desc    Update user profile
// @access  Private
router.patch(
  '/profile',
  authenticateToken,
  [
    body('name')
      .optional()
      .isString()
      .isLength({ max: 50 })
      .withMessage('Name must be a string with maximum 50 characters'),
    body('company')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Company must be a string with maximum 100 characters'),
    body('role')
      .optional()
      .isString()
      .isLength({ max: 50 })
      .withMessage('Role must be a string with maximum 50 characters'),
  ],
  validateRequest,
  updateProfile
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, logout);

export default router;