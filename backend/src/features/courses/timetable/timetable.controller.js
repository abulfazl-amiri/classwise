import * as timetableService from "./timetable.service.js";

const create = async function (req, res, next) {
  try {
    const timetable = await timetableService.create({
      dto: req.body,
      courseId: req.course.id,
    });
    res.status(201).json(timetable);
  } catch (err) {
    next(err);
  }
};

const getByCourseId = async function (req, res, next) {
  try {
    const timetable = await timetableService.getByCourseId(req.course.id);
    res.status(200).json(timetable);
  } catch (err) {
    next(err);
  }
};

const updateByCourseId = async function (req, res, next) {
  try {
    const timetable = await timetableService.updateByCourseId(req.course.id, req.body);
    res.status(200).json(timetable);
  } catch (err) {
    next(err);
  }
};

export { create, getByCourseId, updateByCourseId };
