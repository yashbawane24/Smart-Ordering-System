import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'super-secret-jwt-key-vit-mess-2026-secure-token',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'super-secret-jwt-key-vit-mess-2026-secure-token'
  );
};
