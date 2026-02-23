/**
 * User type definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User without sensitive data
 */
export type SafeUser = Omit<User, 'createdAt' | 'updatedAt'>;
