import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, statusCode, message, err.errors || null);
};
