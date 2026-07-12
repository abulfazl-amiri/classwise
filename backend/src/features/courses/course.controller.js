import * as courseService from "./course.service.js";

const create = async (req, res, next) => {
  try {
    const course = await courseService.create({ dto: req.body, ownerId: req.user.id });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const courses = await courseService.getAll({ teacherId: req.user.id }, queryString);

    res.status(200).json({
      results: courses.length,
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const course = await courseService.getOne({
      id: req.course.id,
      teacherId: req.teacherId,
    });

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const course = await courseService.updateOne(
      { id: req.course.id, teacherId: req.teacherId },
      req.body,
    );

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    await courseService.deleteOne({
      id: req.course.id,
      ownerId: req.ownerId,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const getTeachers = async function (req, res, next) {
  try {
    const teachers = await courseService.getTeachers({
      id: req.course.id,
      teacherId: req.teacherId,
    });
    res.status(200).json({ results: teachers.length, data: teachers });
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, updateOne, deleteOne, getTeachers };
