import APIFeatures from "../../utils/query.util.js";

import AppError from "../../utils/error.util.js";

import * as classService from "./class.service.js";
import { sanitizeBody } from "../../utils/validation.util.js";

//// CRUD

const create = async (req, res, next) => {
  try {
    const createdClasses = await classService.create(sanitizeBody(req));

    const classesArray = Array.isArray(createdClasses) ? createdClasses : [createdClasses];

    res.status(201).json({
      status: "success",
      results: classesArray.length,
      data: {
        classes: classesArray,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const features = new APIFeatures(classService.getAll({ user: req.user._id }), queryString)
      .filter()
      .sort()
      .select()
      .paginate();

    const classes = await features.query;

    res.status(200).json({
      status: "success",
      results: classes.length,
      data: {
        classes: classes,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const cls = await classService.getOne({
      _id: req.params.id,
      user: req.user._id,
    });

    res.status(200).json({
      status: "success",
      data: {
        class: cls,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const updatedClass = await classService.updateOne(
      { _id: req.params.id, user: req.user._id },
      sanitizeBody(req),
    );

    res.status(200).json({
      status: "success",
      data: {
        class: updatedClass,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    await classService.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, updateOne, deleteOne };
