import * as categoryService from './category.service.js';
import { successResponse } from '../../utils/response.js';

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategoryService(req.user._id, req.body);
    return successResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoriesService(req.user._id, req.query);
    return successResponse(res, 200, 'Categories fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryByIdService(req.user._id, req.params.id);
    return successResponse(res, 200, 'Category fetched successfully', category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategoryService(req.user._id, req.params.id, req.body);
    return successResponse(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategoryService(req.user._id, req.params.id);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
