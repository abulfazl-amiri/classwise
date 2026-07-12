import * as courseRepository from "./course.repository.js";
import AppError from "../../utils/error.util.js";
import QueryBuilder from "../../utils/query.util.js";
import { MAX_COURSES_PER_TEACHER } from "../../config/constants.js";

const ensureTeacherCourseLimit = async function (teacherId) {
  const courseCount = await courseRepository.countTeacherCourses(teacherId);
  if (courseCount >= MAX_COURSES_PER_TEACHER)
    throw new AppError("Teacher reached to maximum number of courses", 400);
};

const create = async function ({ dto, ownerId }) {
  await ensureTeacherCourseLimit(ownerId);
  return await courseRepository.create({ ownerId, dto });
};

const getAll = async function ({ teacherId }, queryString) {
  const query = new QueryBuilder(courseRepository.buildQuery({ teacherId }), queryString)
    .filter()
    .sort()
    .select()
    .paginate();

  return await query.execute();
};

const getOne = async function ({ id, teacherId }) {
  const course = await courseRepository.findOne({ id, teacherId });
  if (!course) throw new AppError("Course not found", 404);
  return course;
};

const updateOne = async function ({ id, teacherId }, dto) {
  const { name, subject, fee, currencyCode, startDate, endDate } = dto;
  const safeDto = { name, subject, fee, currencyCode, startDate, endDate };

  for (const [key, value] of Object.entries(safeDto)) {
    if (value === undefined) delete safeDto[key];
  }

  const course = await courseRepository.updateOne({ id, teacherId }, safeDto);
  if (!course) throw new AppError("Course not found", 404);
  return course;
};

const deleteOne = async function ({ id, ownerId }) {
  const course = await courseRepository.deleteOne({ id, ownerId });
  if (!course) throw new AppError("Course not found", 404);
};

const getTeachers = async function ({ id, teacherId }) {
  return await courseRepository.findTeachers({ id, teacherId });
};
export { create, getAll, getOne, updateOne, deleteOne, getTeachers, ensureTeacherCourseLimit };
