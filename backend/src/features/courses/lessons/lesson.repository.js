import Lesson from "./lesson.model.js";

const buildQuery = function ({ courseId }) {
  return Lesson.find({ course: courseId });
};

//

const create = async function ({ dto, courseId }) {
  const { resourceId, ...data } = dto;
  return await Lesson.create({ ...data, resource: resourceId, course: courseId });
};

const getOne = async function ({ id, courseId }) {
  return await Lesson.findOne({ _id: id, course: courseId });
};
const updateOne = async function ({ id, courseId }, dto) {
  const { resourceId, ...data } = dto;
  return await Lesson.findOneAndUpdate(
    { _id: id, course: courseId },
    { ...data, ...(resourceId ? { resource: resourceId } : {}) },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

const deleteOne = async function ({ id, courseId }) {
  return await Lesson.findOneAndDelete({ _id: id, course: courseId });
};

export { create, buildQuery, getOne, updateOne, deleteOne };
