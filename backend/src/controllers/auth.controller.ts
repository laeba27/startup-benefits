import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import { sendMagicLinkEmail } from '../utils/email';
import { asyncHandler } from '../middleware/async.middleware';
import { AppError } from '../utils/AppError';
import {
  generateMagicLinkToken,
  generateTokenPair,
  verifyMagicLinkToken,
  verifyRefreshToken,
  generateAccessToken,
} from '../utils/tokenService';

// Registration endpoint - creates user profile and sends verification email
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, phone, company, role } = req.body;

  if (!email || !name) {
    throw new AppError('Email and name are required', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  // Create new user profile
  const user = await User.create({
    email: email.toLowerCase(),
    profile: {
      name,
      phone: phone || '',
      company: company || '',
      role: role || ''
    },
    isVerified: false
  });

  // Generate magic link token (short-lived)
  const magicToken = generateMagicLinkToken(String(user._id), user.email);

  // Send verification email
  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${magicToken}`;
  
  try {
    await sendMagicLinkEmail(user.email, magicLink, user.profile?.name);
  } catch (error) {
    console.warn('Email sending failed, but token is still valid for testing');
  }

  const responseData: any = {
    success: true,
    message: 'Registration successful! Check your email for verification link.',
    data: {
      userId: user._id
    }
  };

  // In development, also return the token for testing
  if (process.env.NODE_ENV === 'development') {
    responseData.devToken = magicToken;
    responseData.devMagicLink = magicLink;
    console.log('🔗 Development Magic Link:', magicLink);
    console.log('   Development Token:', magicToken);
  }

  res.status(201).json(responseData);
});

// Send magic link for passwordless authentication
export const sendMagicLink = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Find or create user
  let user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    user = await User.create({ email: email.toLowerCase() });
  }

  // Generate magic link token (short-lived)
  const magicToken = generateMagicLinkToken(String(user._id), user.email);

  // Send magic link email
  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${magicToken}`;
  
  try {
    await sendMagicLinkEmail(user.email, magicLink, user.profile?.name);
  } catch (error) {
    console.warn('Email sending failed, but token is still valid for testing');
  }

  // In development, also return the token for testing
  const responseData: any = {
    success: true,
    message: 'Magic link sent to your email',
  };

  if (process.env.NODE_ENV === 'development') {
    responseData.devToken = magicToken;
    responseData.devMagicLink = magicLink;
    console.log('🔗 Development Magic Link:', magicLink);
    console.log('   Development Token:', magicToken);
  }

  res.status(200).json(responseData);
});

// Verify magic link token and authenticate user
export const verifyMagicLink = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Token is required', 400);
  }

  // Verify the magic link token
  let decoded;
  try {
    decoded = verifyMagicLinkToken(token);
    console.log('    Magic link token verified successfully:', { userId: decoded.userId, email: decoded.email });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Token verification failed';
    throw new AppError(`Invalid or expired magic link: ${errorMsg}`, 401);
  }

  // Find user
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    throw new AppError('User not found', 401);
  }

  // Mark user as verified if not already
  if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  // Generate access and refresh tokens
  const tokens = generateTokenPair(String(user._id), user.email);

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        profile: user.profile,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn, // in seconds
        tokenType: 'Bearer',
      },
    },
  });
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-__v');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        adminVerified: user.adminVerified,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    },
  });
});

// Update user profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, company, role, address, city, state, zipCode, country } = req.body;

  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update profile fields
  if (name !== undefined) user.profile = { ...user.profile, name };
  if (phone !== undefined) user.profile = { ...user.profile, phone };
  if (company !== undefined) user.profile = { ...user.profile, company };
  if (role !== undefined) user.profile = { ...user.profile, role };
  if (address !== undefined) user.profile = { ...user.profile, address };
  if (city !== undefined) user.profile = { ...user.profile, city };
  if (state !== undefined) user.profile = { ...user.profile, state };
  if (zipCode !== undefined) user.profile = { ...user.profile, zipCode };
  if (country !== undefined) user.profile = { ...user.profile, country };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        adminVerified: user.adminVerified,
        profile: user.profile,
      },
    },
  });
});

// Logout (client-side token removal)
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

// Refresh access token using refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenFromBody } = req.body;

  if (!refreshTokenFromBody) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenFromBody);
    console.log('    Refresh token verified successfully:', { userId: decoded.userId });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Token verification failed';
    throw new AppError(`Invalid or expired refresh token: ${errorMsg}`, 401);
  }

  // Find user
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(String(user._id), user.email);

  res.status(200).json({
    success: true,
    message: 'Access token refreshed successfully',
    data: {
      accessToken: newAccessToken,
      expiresIn: 3600, // 1 hour in seconds
      tokenType: 'Bearer',
    },
  });
});