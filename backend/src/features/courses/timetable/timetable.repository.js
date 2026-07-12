import Timetable from "./timetable.model.js";

const create = async function ({ dto, courseId }) {
  const safeDto = { ...dto, course: courseId };
  return await Timetable.create(safeDto);
};

const findByCourseId = async function (courseId) {
  return await Timetable.findOne({ course: courseId });
};

const updateByCourseId = async function (courseId, dto) {
  return await Timetable.findOneAndUpdate({ course: courseId }, dto, {
    returnDocument: "after",
    runValidators: true,
  });
};

export { create, findByCourseId, updateByCourseId };
