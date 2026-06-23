import APIFeatures from "../../utils/query.util.js";

import { sanitizeBody } from "../../utils/validation.util.js";
import * as resourceService from "./resource.service.js";
import * as resourceRepository from "./resource.repository.js";
const aliasRecent = function (req, res, next) {
  res.locals.queryOverrides = { sort: "-createdAt", limit: 5 };
  next();
};

const create = async (req, res, next) => {
  try {
    const createdResource = await resourceService.create(sanitizeBody(req));
    res.status(201).json({
      status: "success",
      data: {
        resource: createdResource,
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

    const features = new APIFeatures(
      resourceRepository.buildQuery({ user: req.user._id }),
      queryString,
    )
      .filter()
      .sort()
      .select()
      .paginate();

    const resources = await features.query;

    res.status(200).json({
      status: "success",
      results: resources.length,
      data: {
        resources: resources,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const foundResource = await resourceService.getOne({ _id: req.params.id, user: req.user._id });
    res.status(200).json({
      status: "success",
      data: {
        resources: foundResource,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const updatedResource = await resourceService.updateOne(
      { _id: req.params.id, user: req.user.id },
      sanitizeBody(req),
    );
    res.status(200).json({
      status: "success",
      data: {
        resources: updatedResource,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    await resourceService.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { aliasRecent, create, getAll, getOne, updateOne, deleteOne };
