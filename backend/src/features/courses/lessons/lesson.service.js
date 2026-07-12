import * as lessonRepository from "./lesson.repository.js";
import QueryBuilder from "../../../utils/query.util.js";
import AppError from "../../../utils/error.util.js";

const create = async function ({ dto, courseId }) {
  return await lessonRepository.create({ dto, courseId: courseId });
};

const getAll = async function ({ courseId }, queryString) {
  const query = new QueryBuilder(lessonRepository.buildQuery({ courseId: courseId }), queryString)
    .filter()
    .sort()
    .select()
    .paginate();
  return await query.execute();
};

const getOne = async function ({ id, courseId }) {
  const lesson = await lessonRepository.getOne({ id, courseId });
  if (!lesson) throw new AppError("Lesson not found", 404);
  return lesson;
};
const updateOne = async function ({ id, courseId }, dto) {
  const lesson = await lessonRepository.updateOne({ id, courseId }, dto);
  if (!lesson) throw new AppError("Lesson not found", 404);
  return lesson;
};

const deleteOne = async function (filter) {
  const lesson = await lessonRepository.deleteOne(filter);
  if (!lesson) throw new AppError("Lesson not found", 404);
  return lesson;
};

export { create, getAll, getOne, updateOne, deleteOne };
