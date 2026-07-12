import * as studentService from "./student.service.js";

const create = async function (req, res, next) {
  try {
    const student = await studentService.create({ dto: req.body, createdById: req.user.id });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...res.locals.queryOverrides, ...req.query }
      : req.query;

    const scope = ["all", "enrolled", "unenrolled"].includes(req.query.scope)
      ? req.query.scope
      : undefined;

    const students = await studentService.getAll({ teacherId: req.user.id, scope }, queryString);
    res.status(200).json({
      results: students.length,
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async function (req, res, next) {
  try {
    const student = await studentService.getOne({ id: req.params.id, teacherId: req.user.id });
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};
const updateOne = async function (req, res, next) {
  try {
    const student = await studentService.updateOne({
      dto: req.body,
      id: req.params.id,
      teacherId: req.user.id,
    });
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async function (req, res, next) {
  try {
    await studentService.deleteOne({ teacherId: req.user.id, id: req.params.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const getEnrollments = async function (req, res, next) {
  try {
    const enrollments = await studentService.getEnrollments({
      teacherId: req.user.id,
      id: req.params.id,
    });
    res.status(200).json({
      results: enrollments.length,
      data: enrollments,
    });
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, updateOne, deleteOne, getEnrollments };
