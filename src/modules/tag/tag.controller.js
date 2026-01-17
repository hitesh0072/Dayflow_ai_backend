import * as tagService from './tag.service.js';
import { successResponse } from '../../utils/response.js';

export const createTag = async (req, res, next) => {
  try {
    const tag = await tagService.createTagService(req.user._id, req.body);
    return successResponse(res, 201, 'Tag created successfully', tag);
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req, res, next) => {
  try {
    const result = await tagService.getTagsService(req.user._id, req.query);
    return successResponse(res, 200, 'Tags fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const tag = await tagService.getTagByIdService(req.user._id, req.params.id);
    return successResponse(res, 200, 'Tag fetched successfully', tag);
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const tag = await tagService.updateTagService(req.user._id, req.params.id, req.body);
    return successResponse(res, 200, 'Tag updated successfully', tag);
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const result = await tagService.deleteTagService(req.user._id, req.params.id);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
