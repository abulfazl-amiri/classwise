import * as nonTeachingDayRepository from "./nonTeachingDay.repository.js";
import * as courseRepository from "../courses/course.repository.js";
import AppError from "../../utils/error.util.js";
import QueryBuilder from "../../utils/query.util.js";

const create = async function ({ dto, courseIds, teacherId }) {
  const teacherCourseIds = await courseRepository.findIdsByTeacherId(teacherId);

  const hasPermission = courseIds.every((id) => teacherCourseIds.includes(id));
  if (!hasPermission)
    throw new AppError("You do not have access to one or more of the courseIds", 403);

  return await nonTeachingDayRepository.create({ dto, courseIds });
};

const getAll = async function ({ courseIds }, queryString) {
  const query = new QueryBuilder(nonTeachingDayRepository.buildQuery({ courseIds }), queryString)
    .filter()
    .sort()
    .select()
    .paginate();
  return await query.execute();
};

const getOne = async function ({ id, courseIds }) {
  const nonTeachingDay = await nonTeachingDayRepository.getOne({ id, courseIds });
  if (!nonTeachingDay) throw new AppError("Non-Teaching-Day not foud", 404);
  return nonTeachingDay;
};
const updateOne = async function ({ id, courseIds }, dto) {
  const nonTeachingDay = await nonTeachingDayRepository.updateOne({ id, courseIds }, dto);
  if (!nonTeachingDay) throw new AppError("Non-Teaching-Day not foud", 404);
  return nonTeachingDay;
};
const deleteOne = async function ({ id, courseIds }) {
  const nonTeachingDay = await nonTeachingDayRepository.deleteOne({ id, courseIds });
  if (!nonTeachingDay) throw new AppError("Non-Teaching-Day not foud", 404);
};

export { create, getOne, getAll, updateOne, deleteOne };
