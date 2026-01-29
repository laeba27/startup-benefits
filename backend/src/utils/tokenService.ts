import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  type?: 'access' | 'refresh' | 'magic-link';
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
}

export interface TokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    userId: string;
  };
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Generate Access Token (short-lived, 1 hour)
 */
export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    {
      userId,
      email,
      type: 'access',
    },
    JWT_SECRET,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '1h') } as any
  );
};

/**
 * Generate Refresh Token (long-lived, 7 days)
 */
export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign(
    {
      userId,
      email,
      type: 'refresh',
    },
    JWT_SECRET,
    { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') } as any
  );
};

/**
 * Generate Magic Link Token (very short-lived, 15 minutes)
 */
export const generateMagicLinkToken = (userId: string, email: string): string => {
  return jwt.sign(
    {
      userId,
      email,
      type: 'magic-link',
    },
    JWT_SECRET,
    { expiresIn: (process.env.MAGIC_LINK_EXPIRES_IN || '15m') } as any
  );
};

/**
 * Generate both Access and Refresh tokens
 */
export const generateTokenPair = (userId: string, email: string): Tokens => {
  const accessToken = generateAccessToken(userId, email);
  const refreshToken = generateRefreshToken(userId, email);
  
  // Access token expires in 1 hour = 3600 seconds
  const expiresIn = 3600;

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    console.log('   JWT_SECRET length:', JWT_SECRET.length);
    console.log('   Verifying token with jwt.verify...');
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('    Token decoded successfully:', decoded);
    
    // Allow both tokens without type and access tokens
    if (decoded.type && decoded.type !== 'access') {
      console.log('  Invalid token type:', decoded.type);
      throw new Error(`Invalid token type: ${decoded.type}, expected 'access'`);
    }
    return decoded;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Token verification failed';
    console.log('  Verification error:', msg);
    throw new Error(msg);
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    return decoded;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Refresh token verification failed'
    );
  }
};

/**
 * Verify Magic Link Token
 */
export const verifyMagicLinkToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded.type !== 'magic-link') {
      throw new Error('Invalid magic link token');
    }
    return decoded;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Magic link verification failed'
    );
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) {
    console.log('⚠️  No authorization header provided');
    return null;
  }
  
  console.log('    Authorization Header:', authHeader.substring(0, 30) + '...');
  const parts = authHeader.split(' ');
  console.log('    Header parts:', parts.length, 'parts');
  
  if (parts.length !== 2) {
    console.log('  Invalid header format: expected 2 parts, got', parts.length);
    return null;
  }
  
  if (parts[0].toLowerCase() !== 'bearer') {
    console.log('  Invalid scheme:', parts[0], 'expected Bearer');
    return null;
  }
  
  console.log('    Token extracted successfully');
  return parts[1];
};
