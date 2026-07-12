import * as nonTeachingDayRepository from "./nonTeachingDay.repository.js";
import * as courseRepository from "../courses/course.repository.js";
import AppError from "../../utils/error.util.js";

const authorizeCourses = async function (req, res, next) {
  try {
    const currentUserId = req.user.id;
    const bodyCourseIds = req.body.courseIds;
    if (Array.isArray(bodyCourseIds) && bodyCourseIds.length !== 0) {
      req.courseIds = bodyCourseIds;
      return next();
    }

    const courseIds = await courseRepository.findIdsByTeacherId(currentUserId);

    if (!courseIds?.length)
      throw new AppError(
        "You must be a techer in at least one course to view non-teaching days",
        403,
      );
    req.courseIds = courseIds;

    next();
  } catch (err) {
    next(err);
  }
};

export { authorizeCourses };
