import * as timetableRepository from "./timetable.repository.js";
import AppError from "../../../utils/error.util.js";

const create = async function ({ dto, courseId }) {
  return await timetableRepository.create({ dto, courseId });
};

const getByCourseId = async function (courseId) {
  const timetable = await timetableRepository.findByCourseId(courseId);
  if (!timetable) throw new AppError("Timetable not found", 404);
  return timetable;
};

const updateByCourseId = async function (courseId, dto) {
  const timetable = await timetableRepository.updateByCourseId(courseId, dto);
  if (!timetable) throw new AppError("Timetable not found", 404);
  return timetable;
};

export { create, getByCourseId, updateByCourseId };
