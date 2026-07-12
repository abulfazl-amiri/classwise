import QueryBuilder from "../../../utils/query.util.js";
import * as enrollmentRepository from "./enrollment.repository.js";
import AppError from "../../../utils/error.util.js";

//

const create = async function ({ courseId, dto }) {
  const { studentId, ...data } = dto;
  return await enrollmentRepository.create({ ...data, student: studentId, course: courseId });
};
const getAll = async function ({ courseId, queryString }) {
  const query = new QueryBuilder(enrollmentRepository.buildQuery({ courseId }), queryString)
    .filter()
    .sort()
    .select()
    .paginate();
  return await query.execute();
};

const getOne = async function ({ id, courseId }) {
  const enrollment = await enrollmentRepository.findOne({ id, courseId });
  if (!enrollment) throw new AppError("Enrollment not found", 404);
  return enrollment;
};

const updateOne = async function ({ id, courseId, dto }) {
  const { studentId, ...data } = dto;
  const enrollment = await enrollmentRepository.updateOne(
    { id, courseId },
    { ...data, ...(studentId ? { student: studentId } : {}) },
  );
  if (!enrollment) throw new AppError("Enrollment not found", 404);
  return enrollment;
};

const deleteOne = async function ({ id, courseId }) {
  const enrollment = await enrollmentRepository.deleteOne({ id, courseId });
  if (!enrollment) throw new AppError("Enrollment not found", 404);
  return enrollment;
};

export { create, getAll, getOne, updateOne, deleteOne };
