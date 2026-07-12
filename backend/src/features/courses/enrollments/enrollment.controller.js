import * as enrollmentService from "./enrollment.service.js";

const create = async function (req, res, next) {
  try {
    const enrollment = await enrollmentService.create({ dto: req.body, courseId: req.course.id });
    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;
    const enrollments = await enrollmentService.getAll({ queryString, courseId: req.course._id });
    res.status(200).json({
      results: enrollments.length,
      data: enrollments,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async function (req, res, next) {
  try {
    const enrollment = await enrollmentService.getOne({
      id: req.params.id,
      courseId: req.course.id,
    });
    res.status(200).json(enrollment);
  } catch (err) {
    next(err);
  }
};

const updateOne = async function (req, res, next) {
  try {
    const enrollment = await enrollmentService.updateOne({
      id: req.params.id,
      courseId: req.course.id,
      dto: req.body,
    });
    res.status(200).json(enrollment);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async function (req, res, next) {
  try {
    await enrollmentService.deleteOne({ id: req.params.id, courseId: req.course.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, updateOne, deleteOne };
