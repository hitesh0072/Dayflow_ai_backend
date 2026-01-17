import * as taskService from './task.service.js';
import { successResponse } from '../../utils/response.js';

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTaskService(req.user._id, req.body);
    return successResponse(res, 201, 'Task created successfully', task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksService(req.user._id, req.query);
    return successResponse(res, 200, 'Tasks fetched successfully', tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskByIdService(req.user._id, req.params.id);
    return successResponse(res, 200, 'Task fetched successfully', task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskService(req.user._id, req.params.id, req.body);
    return successResponse(res, 200, 'Task updated successfully', task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTaskService(req.user._id, req.params.id);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStatsService(req.user._id);
    return successResponse(res, 200, 'Task stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatusService(req.user._id, req.params.id, req.body.status);
    return successResponse(res, 200, 'Task status updated successfully', task);
  } catch (error) {
    next(error);
  }
};