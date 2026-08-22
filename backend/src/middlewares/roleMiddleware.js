import { errorResponse } from '../utils/response.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
      );
    }
    next();
  };
};
