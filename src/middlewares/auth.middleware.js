import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../modules/auth/auth.model.js';
import { errorResponse } from '../utils/response.js';

import TokenBlocklist from '../modules/auth/tokenBlocklist.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }

  try {
    const isBlocked = await TokenBlocklist.findOne({ token });
    if (isBlocked) {
      return errorResponse(res, 401, 'Token revoked. Please login again.');
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }
};
