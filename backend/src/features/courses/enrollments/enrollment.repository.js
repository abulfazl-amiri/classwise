import Enrollment from "./enrollment.model.js";

// query builder for getAll service
const buildQuery = function (filter) {
  const query = {};
  if (filter.courseId) query.course = filter.courseId;
  return Enrollment.find(query);
};
//

const create = async function (dto) {
  return await Enrollment.create(dto);
};

const findOne = async function ({ id, courseId }) {
  return await Enrollment.findOne({ _id: id, course: courseId });
};

const findCourseIdsByStudentId = async function (studentId) {
  const results = await Enrollment.find({ student: studentId }).select("-_id course");
  return results.map((result) => result.course);
};

const findStudentIdsByIds = async function (ids) {
  return await Enrollment.distinct("student", { _id: { $in: ids } });
};

const updateOne = async function ({ id, courseId }, dto) {
  return await Enrollment.findOneAndUpdate({ _id: id, course: courseId }, dto, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteOne = async function ({ id, courseId }) {
  return await Enrollment.findOneAndDelete({ _id: id, course: courseId });
};

export {
  buildQuery,
  create,
  findOne,
  updateOne,
  deleteOne,
  findCourseIdsByStudentId,
  findStudentIdsByIds,
};
