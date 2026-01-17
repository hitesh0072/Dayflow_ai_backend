import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    color: {
      type: String,
      default: '#000000',
    },
    icon: {
      type: String,
      default: 'default-icon',
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

// Ensure unique category names per user
categorySchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
