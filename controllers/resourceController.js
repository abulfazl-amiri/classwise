import Resource from "../models/Resource.js";
import APIFeatures from "./../utils/apiFeatures.js";

import appError from "./../utils/appError.js";

// ALIASES
const aliasRecent = function (req, res, next) {
  res.locals.queryOverrides = { sort: "-createdAt", limit: 5 };
  next();
};

// CRUD
const createResource = async (req, res) => {
  try {
    // filtering for _id and __v to not let client create their own ones
    let resources;
    if (Array.isArray(req.body)) {
      resources = req.body.map((resource) => {
        const { _id, __v, ...rest } = resource;
        return rest;
      });
    } else {
      console.log(req.body);
      const { _id, __v, ...rest } = req.body;
      resources = rest;
    }

    const createdResources = await Resource.create(resources);
    res.status(201).json({
      status: "success",
      results: createdResources.length,
      data: {
        resources: createdResources,
      },
    });
  } catch (err) {
    throw new appError(err.message, 400);
  }
};

const getAllResource = async (req, res) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const features = new APIFeatures(Resource.find({}), queryString)
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
    throw new appError(err.message, 400);
  }
};

const getById = async (req, res) => {
  try {
    const foundResource = await Resource.findById(req.params.id); // parsing from /:id in the url
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
    throw new appError(err.message, 400);
  }
};

const updateById = async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

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
    throw new appError(err.message, 400);
  }
};

const deleteById = async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);

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
    throw new appError(err.message, 400);
  }
};

// AGGREGATIONS
const findResourcesByLevel = async function (req, res) {
  try {
    const data = await Resource.aggregate([
      { $match: { level: { $in: ["Beginner"] } } },
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
    throw new appError(err.message, 400);
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
