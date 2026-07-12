import * as studentRepository from "./student.repository.js";
import QueryBuilder from "../../utils/query.util.js";
import AppError from "../../utils/error.util.js";
import * as enrollmentRepository from "../courses/enrollments/enrollment.repository.js";
import * as courseRepository from "../courses/course.repository.js";

const authorizeTeacher = async function ({ id, teacherId }) {
  const ownedStudent = await studentRepository.findOne({ id, createdById: teacherId });
  if (ownedStudent) return;

  const courseIds = await enrollmentRepository.findCourseIdsByStudentId(id);

  // is teacher in at least one of students' enrolled courses
  let isTheTeacher;
  for (let courseId of courseIds) {
    const isTeacher = await courseRepository.isTeacherInCourse({ teacherId, id: courseId });
    if (!isTeacher) continue;
    isTheTeacher = true;
    break;
  }

  if (!isTheTeacher) throw new AppError("You are not the teacher of this student", 403);
};

const getStudentIdsByTeacherId = async function (teacherId) {
  const enrollmentIds = await courseRepository.findAllEnrollmentIdsByTeacherId(teacherId);
  return await enrollmentRepository.findStudentIdsByIds(enrollmentIds);
};

const create = async function ({ dto, createdById }) {
  return await studentRepository.create({ dto, createdById });
};

const getAll = async function ({ teacherId, queryString, scope = "all" }) {
  const [studentsForCreatedBy, enrolledStudents] = await Promise.all([
    new QueryBuilder(studentRepository.buildQuery({ createdById: teacherId }), queryString)
      .filter()
      .sort()
      .select()
      .paginate()
      .execute(),

    (async () => {
      const studentIds = await getStudentIdsByTeacherId(teacherId);

      return new QueryBuilder(studentRepository.buildQueryByIds(studentIds), queryString)
        .filter()
        .sort()
        .select()
        .paginate()
        .execute();
    })(),
  ]);

  const enrolledIds = new Set(enrolledStudents.map((s) => s.id));

  switch (scope) {
    case "enrolled":
      return enrolledStudents;

    case "unenrolled":
      return studentsForCreatedBy.filter((s) => !enrolledIds.has(s.id));

    case "all":
    default:
      return [...enrolledStudents, ...studentsForCreatedBy.filter((s) => !enrolledIds.has(s.id))];
  }
};

const getOne = async function ({ teacherId, id }) {
  await authorizeTeacher({ id, teacherId });

  const student = await studentRepository.findById(id);
  if (!student) throw new AppError("Student not found", 404);
  return student;
};

const updateOne = async function ({ id, teacherId, dto }) {
  await authorizeTeacher({ id, teacherId });

  const student = await studentRepository.updateOne({ id: id, createdById: teacherId }, dto);
  if (!student) throw new AppError("Student not found", 404);
  return student;
};

const deleteOne = async function ({ teacherId, id }) {
  const student = await studentRepository.deleteOne({ id: id, createdById: teacherId });
  if (!student) throw new AppError("Student not found", 404);
};

const getEnrollments = async function ({ id, teacherId }) {
  await authorizeTeacher({ id, teacherId });
  const result = await studentRepository.findEnrollments({ id: id });
  return result ?? [];
};

export { create, getAll, getOne, updateOne, deleteOne, getEnrollments };
