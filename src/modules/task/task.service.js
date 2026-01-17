import Task from "./task.model.js";
import Category from "../category/category.model.js";
import Tag from "../tag/tag.model.js";

export const createTaskService = async (userId, data) => {
  // Validate Category
  const category = await Category.findOne({
    _id: data.category,
    createdBy: userId,
  });
  if (!category) {
    throw {
      statusCode: 400,
      message: "Invalid category or category does not belong to user",
    };
  }

  // Validate Tags
  if (data.tags && data.tags.length > 0) {
    const validTags = await Tag.countDocuments({
      _id: { $in: data.tags },
      createdBy: userId,
    });
    if (validTags !== data.tags.length) {
      throw {
        statusCode: 400,
        message: "One or more tags are invalid or do not belong to user",
      };
    }
  }

  const task = await Task.create({ ...data, createdBy: userId });
  return task;
};

export const getTasksService = async (userId, query) => {
  // 1. Lazy update: Find active tasks with past due dates and set to overdue
  const now = new Date();
  await Task.updateMany(
    {
      createdBy: userId,
      status: "active",
      dueDate: { $lt: now },
    },
    {
      $set: { status: "overdue" },
    },
  );

  const filter = { createdBy: userId };

  if (query.priority) {
    filter.priority = query.priority;
  }
  if (query.category) {
    filter.category = query.category;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(afterTomorrow.getDate() + 1);

    if (query.dueDate === "today") {
      filter.dueDate = { $gte: today, $lt: tomorrow };
    } else if (query.dueDate === "tomorrow") {
      filter.dueDate = { $gte: tomorrow, $lt: afterTomorrow };
    }
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .populate("category", "name color icon")
    .populate("tags", "name color")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(filter);

  return {
    items: tasks,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTaskByIdService = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId })
    .populate("category", "name color icon")
    .populate("tags", "name color");

  if (!task) {
    throw { statusCode: 404, message: "Task not found" };
  }
  return task;
};

export const updateTaskService = async (userId, taskId, data) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId });
  if (!task) {
    throw { statusCode: 404, message: "Task not found" };
  }

  // Validate Category if updating
  if (data.category) {
    const category = await Category.findOne({
      _id: data.category,
      createdBy: userId,
    });
    if (!category) {
      throw { statusCode: 400, message: "Invalid category" };
    }
  }

  // Validate Tags if updating
  if (data.tags) {
    const validTags = await Tag.countDocuments({
      _id: { $in: data.tags },
      createdBy: userId,
    });
    if (validTags !== data.tags.length) {
      throw { statusCode: 400, message: "Invalid tags" };
    }
  }

  Object.assign(task, data);
  await task.save();
  return task;
};

export const deleteTaskService = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });
  if (!task) {
    throw { statusCode: 404, message: "Task not found" };
  }
  return { message: "Task deleted successfully" };
};

export const getTaskStatsService = async (userId) => {
  // 1. Get all categories for the user
  const allCategories = await Category.find({ createdBy: userId }).lean();

  // 2. Get task counts grouped by category
  const stats = await Task.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  // 3. Map counts to a lookup object for easier access
  const statsMap = stats.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  // 4. Merge all categories with their counts (default 0)
  const result = allCategories.map((category) => ({
    categoryId: category._id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    count: statsMap[category._id.toString()] || 0,
  }));

  return result;
};;

export const updateTaskStatusService = async (userId, taskId, status) => {
  if (!['active', 'overdue', 'completed'].includes(status)) {
    throw { statusCode: 400, message: 'Invalid status' };
  }

  const task = await Task.findOne({ _id: taskId, createdBy: userId });
  if (!task) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  task.status = status;
  await task.save();

  return task;
};

export const getTasksByIdsService = async (userId, taskIds) => {
  const tasks = await Task.find({
    _id: { $in: taskIds },
    createdBy: userId,
  })
    .populate("category", "name")
    .populate("tags", "name");
  return tasks;
};

export const getAllActiveTasksService = async (userId, categoryId) => {
  const query = {
    createdBy: userId,
    status: 'active'
  };

  if (categoryId) {
    query.category = categoryId;
  }

  return await Task.find(query)
  .populate("category", "name")
  .populate("tags", "name");
};
