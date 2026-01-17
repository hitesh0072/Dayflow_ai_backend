import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "./auth.model.js";
import Category from "../category/category.model.js";
import Tag from "../tag/tag.model.js";
import { sendEmail } from "../../config/mail.js";
import { env } from "../../config/env.js";
import { getVerificationEmailTemplate } from "../../utils/emailTemplates.js";

export const registerService = async (userData) => {
  const { firstName, lastName, username, email, password, profileImage } =
    userData;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw {
      statusCode: 400,
      message: "User with this email or username already exists",
    };
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Create user
  const newUser = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    emailOTP: otp,
    emailOTPExpires: otpExpires,
    isEmailVerified: false,
    profileImage,
  });

  // Create Default Categories
  const defaultCategories = [
    {
      name: "Work",
      color: "#FF5733",
      icon: "briefcase",
      createdBy: newUser._id,
    },
    {
      name: "Personal",
      color: "#33FF57",
      icon: "user",
      createdBy: newUser._id,
    },
    {
      name: "Shopping",
      color: "#3357FF",
      icon: "shopping-cart",
      createdBy: newUser._id,
    },
    { name: "Health", color: "#F333FF", icon: "heart", createdBy: newUser._id },
    {
      name: "Education",
      color: "#FF33A1",
      icon: "book",
      createdBy: newUser._id,
    },
  ];
  await Category.insertMany(defaultCategories);

  // Create Default Tags
  const defaultTags = [
    { name: "Urgent", color: "#FF0000", createdBy: newUser._id },
    { name: "Important", color: "#FFA500", createdBy: newUser._id },
    { name: "Low Priority", color: "#008000", createdBy: newUser._id },
    { name: "Review", color: "#0000FF", createdBy: newUser._id },
    { name: "Ideas", color: "#800080", createdBy: newUser._id },
  ];
  await Tag.insertMany(defaultTags);

  // Send OTP email

  await sendEmail(
    email,
    "Verify Your Email",
    getVerificationEmailTemplate(otp),
  );

  return {
    message: "Registration successful. Please check your email for OTP.",
  };
};

export const verifyEmailService = async ({ email, otp }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  if (user.isEmailVerified) {
    throw { statusCode: 400, message: "Email is already verified" };
  }

  if (user.emailOTP !== otp || user.emailOTPExpires < Date.now()) {
    throw { statusCode: 400, message: "Invalid or expired OTP" };
  }

  user.isEmailVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpires = undefined;
  await user.save();

  return { message: "Email verified successfully. You can now login." };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  if (!user.isEmailVerified) {
    throw {
      statusCode: 403,
      message: "Email not verified. Please verify your email first.",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    env.jwtSecret,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      language: user.language,
    },
  };
};

export const checkUsernameService = async (username) => {
  const user = await User.findOne({ username });

  if (!user) {
    return { available: true, message: "Username is available" };
  }

  // Generate suggestions
  const suggestions = [];
  while (suggestions.length < 3) {
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digit number
    const suggestion = `${username}${randomSuffix}`;
    // Ensure suggestion is unique (basic check, for high volume usage valid check against DB needed but acceptable for this scope)
    // To be more robust, we should check DB for suggestions too, but for now let's assume random collision is low or accept optimistic suggestion
    suggestions.push(suggestion);
  }

  // A slightly better approach for suggestions would be checking them asynchronously if strict uniqueness is needed,
  // but let's stick to simple generation first as per common requirement.
  // If user picks one, the standard register flow will validate it anyway.

  return {
    available: false,
    message: "Username is taken",
    suggestions,
  };
};

export const updateProfileService = async (userId, updateData, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  // Handle text fields
  if (updateData.firstName) user.firstName = updateData.firstName;
  if (updateData.lastName) user.lastName = updateData.lastName;
  if (updateData.language) user.language = updateData.language;
  if (updateData.username) user.username = updateData.username;

  // Handle Profile Image
  if (file) {
    user.profileImage = file.path.replace(/\\/g, "/"); // Normalize path for Windows
  } else if (
    updateData.removeProfileImage === "true" ||
    updateData.removeProfileImage === true
  ) {
    user.profileImage = null;
  }

  await user.save();

  return {
    message: "Profile updated successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      language: user.language,
    },
  };
};

export const resendOtpService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  if (user.isEmailVerified) {
    throw { statusCode: 400, message: "Email is already verified" };
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  user.emailOTP = otp;
  user.emailOTPExpires = otpExpires;
  await user.save();

  // Send OTP email
  await sendEmail(
    email,
    "Resend Verification Email",
    getVerificationEmailTemplate(otp),
  );

  return { message: "OTP resent successfully. Please check your email." };
};
