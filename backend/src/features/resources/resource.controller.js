import { sanitizeBody } from "../../utils/validation.util.js";
import * as resourceService from "./resource.service.js";

const aliasRecent = function (req, res, next) {
  res.locals.queryOverrides = { sort: "-createdAt", limit: 5 };
  next();
};

const create = async (req, res, next) => {
  try {
    const sanitizedBody = sanitizeBody(req);
    const payload = {
      ...sanitizedBody,
      teacher: req.user._id,
    };
    delete payload.user;

    const createdResource = await resourceService.create(payload);
    res.status(201).json(createdResource);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const resources = await resourceService.getAll(req.user._id, queryString);
    res.status(200).json({
      results: resources.length,
      data: resources,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const foundResource = await resourceService.getOne({
      _id: req.params.id,
      teacher: req.user._id,
    });
    res.status(200).json(foundResource);
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const sanitizedBody = sanitizeBody(req);
    delete sanitizedBody.user;
    delete sanitizedBody.teacher;

    const updatedResource = await resourceService.updateOne(
      { _id: req.params.id, teacher: req.user._id },
      sanitizedBody,
    );
    res.status(200).json(updatedResource);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    await resourceService.deleteOne({
      _id: req.params.id,
      teacher: req.user._id,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { aliasRecent, create, getAll, getOne, updateOne, deleteOne };
