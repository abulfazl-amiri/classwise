import Resource from "../models/Resource.js";
import APIFeatures from "./../utils/apiFeatures.js";

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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const foundResource = await Resource.findById(req.params.id); // parsing from /:id in the url
    if (!foundResource) {
      res.status(404).json({
        status: "fail",
        message: "Resource not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: {
        resources: foundResource,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const updateById = async (req, res) => {
  try {
    const foundResource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!foundResource) {
      res.status(404).json({
        status: "fail",
        message: "Resource not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: {
        resources: foundResource,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);

    if (!deletedResource) {
      res.status(404).json({
        status: "fail",
        message: "Resource not found",
      });
      return;
    }
    res.status(204).json({
      status: "success",
      data: {
        resources: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// AGGREGATIONS
const findResourcesByLevel = async function (req, res) {
  try {
    const data = await Resource.aggregate([
      { $match: { level: { $in: ["Beginner", "Intermediate", "Advanced"] } } },
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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
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
