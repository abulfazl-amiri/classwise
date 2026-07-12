import * as nonTeachingDayService from "./nonTeachingDay.service.js";

const create = async function (req, res, next) {
  try {
    const nonTeachingDay = await nonTeachingDayService.create({
      dto: req.body,
      courseIds: req.courseIds,
      teacherId: req.user.id,
    });
    res.status(201).json(nonTeachingDay);
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...res.locals.queryOverrides, ...req.query }
      : req.query;
    const nonTeachingDays = await nonTeachingDayService.getAll(
      { courseIds: req.courseIds },
      queryString,
    );
    res.status(200).json({
      results: nonTeachingDays.length,
      data: nonTeachingDays,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async function (req, res, next) {
  try {
    const nonTeachingDay = await nonTeachingDayService.getOne({
      id: req.params.id,
      courseIds: req.courseIds,
    });
    res.status(200).json(nonTeachingDay);
  } catch (err) {
    next(err);
  }
};
const updateOne = async function (req, res, next) {
  try {
    const nonTeachingDay = await nonTeachingDayService.updateOne(
      { id: req.params.id, courseIds: req.courseIds },
      req.body,
    );
    res.status(200).json(nonTeachingDay);
  } catch (err) {
    next(err);
  }
};
const deleteOne = async function (req, res, next) {
  try {
    await nonTeachingDayService.deleteOne({ id: req.params.id, courseIds: req.courseIds });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, updateOne, deleteOne };
