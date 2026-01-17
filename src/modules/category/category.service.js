import Category from "./category.model.js";

export const createCategoryService = async (userId, data) => {
  const existingCategory = await Category.findOne({
    name: data.name,
    createdBy: userId,
  });
  if (existingCategory) {
    throw {
      statusCode: 400,
      message: "Category with this name already exists",
    };
  }

  const category = await Category.create({ ...data, createdBy: userId });
  return category;
};

export const getCategoriesService = async (userId, query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find({ createdBy: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Category.countDocuments({ createdBy: userId });

  return {
    items: categories,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getCategoryByIdService = async (userId, categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    createdBy: userId,
  });
  if (!category) {
    throw { statusCode: 404, message: "Category not found" };
  }
  return category;
};

export const updateCategoryService = async (userId, categoryId, data) => {
  const category = await Category.findOne({
    _id: categoryId,
    createdBy: userId,
  });
  if (!category) {
    throw { statusCode: 404, message: "Category not found" };
  }

  Object.assign(category, data);
  await category.save();
  return category;
};

export const deleteCategoryService = async (userId, categoryId) => {
  const category = await Category.findOneAndDelete({
    _id: categoryId,
    createdBy: userId,
  });
  if (!category) {
    throw { statusCode: 404, message: "Category not found" };
  }
  return { message: "Category deleted successfully" };
};
