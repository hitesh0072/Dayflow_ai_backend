import * as aiService from "./ai.service.js";
import * as taskService from "../task/task.service.js";
import { successResponse } from "../../utils/response.js";

export const summarize = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const task = await taskService.getTaskByIdService(req.user._id, taskId); // Reusing existing service
    const summary = await aiService.generateSummaryService(
      task.description || task.title,
    );
    return successResponse(res, 200, "Summary generated", { summary });
  } catch (error) {
    next(error);
  }
};

export const prioritize = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    const tasks = await taskService.getAllActiveTasksService(
      req.user._id,
      categoryId,
    );
    if (tasks.length === 0) {
      return successResponse(res, 200, "No active tasks to prioritize", {
        top_priorities: [],
      });
    }
    const priorities = await aiService.prioritizeTasksService(tasks);
    return successResponse(res, 200, "Tasks prioritized", priorities);
  } catch (error) {
    next(error);
  }
};

export const estimate = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const task = await taskService.getTaskByIdService(req.user._id, taskId);
    // Construct details from task
    const details = `Title: ${task.title}, Description: ${task.description}, Category: ${task.category?.name}, Tags: ${task.tags?.map((t) => t.name).join(", ")}`;
    const estimate = await aiService.estimateTimeService(details);
    return successResponse(res, 200, "Time estimated", { estimate });
  } catch (error) {
    next(error);
  }
};

export const getPrompts = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const task = await taskService.getTaskByIdService(req.user._id, taskId);
    const prompts = await aiService.generateConcisePromptsService(task.title);
    return successResponse(res, 200, "Prompts generated", { prompts });
  } catch (error) {
    next(error);
  }
};

export const breakdown = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const task = await taskService.getTaskByIdService(req.user._id, taskId);
    const subtasks = await aiService.breakdownTaskService(
      task.description || task.title,
    );
    return successResponse(res, 200, "Task breakdown generated", { subtasks });
  } catch (error) {
    next(error);
  }
};
