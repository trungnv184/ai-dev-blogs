/**
 * Authentication type definitions
 */

import { SafeUser } from './user';

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response with tokens and user data
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT token payload
 */
export interface TokenPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
