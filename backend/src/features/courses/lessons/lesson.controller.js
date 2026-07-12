import * as lessonService from "./lesson.service.js";
const create = async function (req, res, next) {
  try {
    const lesson = await lessonService.create({
      dto: req.body,
      courseId: req.course.id,
    });
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const lessons = await lessonService.getAll({ courseId: req.course.id }, queryString);
    res.status(200).json({
      results: lessons.length,
      data: lessons,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async function (req, res, next) {
  try {
    const lesson = await lessonService.getOne({ id: req.params.id, courseId: req.course.id });
    res.status(200).json(lesson);
  } catch (err) {
    next(err);
  }
};

const updateOne = async function (req, res, next) {
  try {
    const lesson = await lessonService.updateOne(
      { id: req.params.id, courseId: req.course.id },
      req.body,
    );
    res.status(200).json(lesson);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async function (req, res, next) {
  try {
    await lessonService.deleteOne({ id: req.params.id, courseId: req.course.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, updateOne, deleteOne };
