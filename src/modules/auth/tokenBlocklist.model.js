import mongoose from "mongoose";

const tokenBlocklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d", // Automatically remove document after 1 day (matching JWT expiry)
  },
});

const TokenBlocklist = mongoose.model("TokenBlocklist", tokenBlocklistSchema);

export default TokenBlocklist;
