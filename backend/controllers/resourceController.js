import Resource from "../models/Resource.js";
import APIFeatures from "./../utils/apiFeatures.js";

import appError from "./../utils/appError.js";

// ALIASES
const aliasRecent = function (req, res, next) {
  res.locals.queryOverrides = { sort: "-createdAt", limit: 5 };
  next();
};

// CRUD
const createResource = async (req, res, next) => {
  try {
    // filtering for _id and __v to not let client create their own ones
    let resources;
    if (Array.isArray(req.body)) {
      resources = req.body.map((resource) => {
        const { _id, __v, ...rest } = resource;
        return { ...rest, user: req.user.id };
      });
    } else {
      const { _id, __v, ...rest } = req.body;
      resources = { ...rest, user: req.user.id };
    }

    const createdResources = await Resource.create(resources);
    const resourcesArray = Array.isArray(createdResources) ? createdResources : [createdResources]
    res.status(201).json({
      status: "success",
      results: resourcesArray.length,
      data: {
        resources: resourcesArray,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllResource = async (req, res, next) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const features = new APIFeatures(Resource.find({ user: req.user.id }), queryString)
      .filter()
      .sort()
      .select()
      .paginate();

    const allResources = await features.query;

    res.status(200).json({
      status: "success",
      results: allResources.length,
      data: {
        resources: allResources,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const foundResource = await Resource.findOne({ _id: req.params.id, user: req.user.id });
    if (!foundResource) {
      throw new appError("Resource not found", 404);
    }
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

const updateById = async (req, res, next) => {
  try {
    const { _id, __v, user, ...safeBody } = req.body;
    const updatedResource = await Resource.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      safeBody,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedResource) {
      throw new appError("Resource not found", 404);
    }
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

const deleteById = async (req, res, next) => {
  try {
    const deletedResource = await Resource.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedResource) {
      throw new appError("Resource not found", 404);
    }
    res.status(204).json({
      status: "success",
      data: {
        resources: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// AGGREGATIONS
const findResourcesByLevel = async function (req, res, next) {
  try {
    const data = await Resource.aggregate([
      {
        $match: {
          level: {
            $in: [
              "beginner",
              "pre-intermediate",
              "intermediate",
              "upper-intermediate",
              "advanced",
              "general",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$level",
          about: { $push: { name: "$name", author: "$author" } },
          numOfResources: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          level: "$_id",
          quantity: "$numOfResources",
          resource: "$about",
          _id: 0,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        data: data,
      },
    });
  } catch (err) {
    next(err);
  }
};

export {
  aliasRecent,
  createResource,
  getAllResource,
  getById,
  updateById,
  deleteById,
  findResourcesByLevel,
};
