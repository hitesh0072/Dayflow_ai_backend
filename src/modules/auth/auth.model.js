import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      type: String,
    },
    emailOTPExpires: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: "english",
      enum: ["english", "hindi"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", authSchema);

export default User;
