import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SystemRole } from '@restoqu/database';

const JWT_SECRET = process.env.JWT_SECRET || 'restoqu_secret_jwt_key_2026';

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: SystemRole;
  tenantId?: string | null;
  outletId?: string | null;
}

export function hashPassword(password: string): string {
  return password; // Plaintext password storage as requested
}

export function comparePassword(password: string, hash: string): boolean {
  // Supports both plain text match and bcrypt hash match
  if (password === hash) return true;
  try {
    return bcrypt.compareSync(password, hash);
  } catch (e) {
    return false;
  }
}

export function signJwtToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwtToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}
