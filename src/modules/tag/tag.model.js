import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
    },
    color: {
      type: String,
      default: '#000000',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique tag names per user
tagSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
