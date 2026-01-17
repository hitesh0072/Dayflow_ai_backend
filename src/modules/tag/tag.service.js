import Tag from "./tag.model.js";

export const createTagService = async (userId, data) => {
  const existingTag = await Tag.findOne({ name: data.name, createdBy: userId });
  if (existingTag) {
    throw { statusCode: 400, message: "Tag with this name already exists" };
  }

  const tag = await Tag.create({ ...data, createdBy: userId });
  return tag;
};

export const getTagsService = async (userId, query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const tags = await Tag.find({ createdBy: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Tag.countDocuments({ createdBy: userId });

  return {
    items: tags,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTagByIdService = async (userId, tagId) => {
  const tag = await Tag.findOne({ _id: tagId, createdBy: userId });
  if (!tag) {
    throw { statusCode: 404, message: "Tag not found" };
  }
  return tag;
};

export const updateTagService = async (userId, tagId, data) => {
  const tag = await Tag.findOne({ _id: tagId, createdBy: userId });
  if (!tag) {
    throw { statusCode: 404, message: "Tag not found" };
  }

  Object.assign(tag, data);
  await tag.save();
  return tag;
};

export const deleteTagService = async (userId, tagId) => {
  const tag = await Tag.findOneAndDelete({ _id: tagId, createdBy: userId });
  if (!tag) {
    throw { statusCode: 404, message: "Tag not found" };
  }
  return { message: "Tag deleted successfully" };
};
