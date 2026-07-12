import * as courseRepository from "./course.repository.js";
import AppError from "../../utils/error.util.js";

const authorizeCourseTeacher = async function (req, res, next) {
  try {
    const courseId = req.params.courseId ?? req.params.id;
    const currentUserId = req.user.id;

    const course = await courseRepository.findByIdAndTeacherId(courseId, currentUserId);
    if (!course) throw new AppError("You do not have access to this course", 403);

    req.teacherId = currentUserId;
    req.course = course;
    next();
  } catch (err) {
    next(err);
  }
};

const authorizeCourseOwner = async function (req, res, next) {
  try {
    const courseId = req.params.courseId ?? req.params.id;
    const currentUserId = req.user.id;

    const course = await courseRepository.findByIdAndOwnerId(courseId, currentUserId);
    if (!course) throw new AppError("You do not have permission for this operation", 403);
    req.ownerId = currentUserId;
    req.course = course;
    next();
  } catch (err) {
    next(err);
  }
};
export { authorizeCourseTeacher, authorizeCourseOwner };
