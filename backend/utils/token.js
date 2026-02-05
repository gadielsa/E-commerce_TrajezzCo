import jwt from 'jsonwebtoken';

export const generateToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    ...options
  });
};
