import Course from "./course.model.js";

// building query for getAll
const buildQuery = function ({ ownerId, teacherId, name, subject } = {}) {
  const query = {};
  if (ownerId) query.owner = ownerId;
  if (teacherId) query.teachers = teacherId;
  if (name) query.name = name;
  if (subject) query.subject = subject;

  return Course.find(query);
};

//

const create = async function ({ dto, ownerId }) {
  const safeDto = { ...dto, owner: ownerId, teachers: [ownerId] };
  return await Course.create(safeDto);
};

const findOne = async function ({ id, teacherId }) {
  return await Course.findOne({ _id: id, teachers: teacherId });
};

const findById = async function (id) {
  return await Course.findById(id);
};

const findByIdAndTeacherId = async function (id, teacherId) {
  // implicit way of teachers:{$in: [teacherId]}
  return await Course.findOne({ _id: id, teachers: teacherId });
};

const findByIdAndOwnerId = async function (id, ownerId) {
  return await Course.findOne({ _id: id, owner: ownerId });
};

const findIdsByTeacherId = async function (teacherId) {
  const results = await Course.find({ teachers: teacherId }).select("_id");
  return results.map((result) => result.id);
};

const findAllEnrollmentIdsByTeacherId = async function (teacherId) {
  const results = await Course.find({ teachers: teacherId }).select("-_id enrollments");
  return results.map((result) => result.enrollments).flat();
};

const countTeacherCourses = async function (teacherId) {
  return await Course.countDocuments({ teachers: teacherId });
};

const findAll = async function ({ teacherId }) {
  return await Course.find({ teachers: teacherId });
};

const updateOne = async function ({ id, teacherId }, dto) {
  return await Course.findOneAndUpdate({ _id: id, teachers: teacherId }, dto, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteOne = async function ({ id, ownerId }) {
  return await Course.findOneAndDelete({ _id: id, owner: ownerId });
};

const addTeacher = async function ({ id, teacherId }) {
  return await Course.findOneAndUpdate(
    { _id: id },
    { $push: { teachers: teacherId } },
    { returnDocument: "after", runValidators: true },
  );
};
const removeTeacher = async function ({ id, ownerId, teacherId }) {
  return await Course.findOneAndUpdate(
    { _id: id, owner: ownerId },
    { $pull: { teachers: teacherId } },
    { returnDocument: "after", runValidators: true },
  );
};
const findTeachers = async function ({ id, teacherId }) {
  const result = await Course.findOne({ _id: id, teachers: teacherId }).select("-_id teachers");
  return result?.teachers;
};

const isTeacherInCourse = async function ({ teacherId, id }) {
  const result = await Course.findOne({ _id: id, teachers: teacherId });
  return Boolean(result);
};

export {
  create,
  findOne,
  findAll,
  findById,
  findByIdAndOwnerId,
  findByIdAndTeacherId,
  findIdsByTeacherId,
  findAllEnrollmentIdsByTeacherId,
  findTeachers,
  updateOne,
  deleteOne,
  buildQuery,
  addTeacher,
  removeTeacher,
  countTeacherCourses,
  isTeacherInCourse,
};
