import * as authService from './auth.service.js';
import { successResponse } from '../../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match');
      error.statusCode = 400;
      throw error;
    }

    const userData = { ...req.body };
    if (req.file) {
      userData.profileImage = req.file.path.replace(/\\/g, '/'); // Store the local path
    }

    const result = await authService.registerService(userData);
    return successResponse(res, 201, result.message);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmailService(req.body);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginService(req.body);
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.query;
    
    if (!username) {
        const error = new Error('Username is required');
        error.statusCode = 400;
        throw error;
    }

    const result = await authService.checkUsernameService(username);
    return successResponse(res, 200, result.message, result);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const result = await authService.updateProfileService(req.user._id, req.body, req.file);
    return successResponse(res, 200, result.message, result.user);
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }
    
    const result = await authService.resendOtpService(email);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};


import TokenBlocklist from './tokenBlocklist.model.js';

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await TokenBlocklist.create({ token });
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
