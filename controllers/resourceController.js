import Resource from "../models/Resource.js";

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
    let { page, limit, fields, sort, ...queryObj } = req.query;

    // Convert comparison operators to MongoDB syntax: e.g. { gte: '100' } -> { $gte: '100' }
    for (let [key, val] of Object.entries(queryObj)) {
      if (typeof val !== "object") continue;

      queryObj[key] = Object.entries(val).reduce((acc, entry) => {
        const [k, v] = entry;
        if (v === undefined) return acc;
        acc[`$${k}`] = v;
        return acc;
      }, {});
    }

    let query = Resource.find(queryObj);

    // sort
    if (!sort) sort = "-createdAt";
    sort = sort.split(",").join(" ");
    query = query.sort(sort);

    // select
    if (!fields) fields = "-createdAt -updatedAt -__v";
    fields = fields.split(",").join(" ");
    query = query.select(fields);

    // paginate
    if (!limit) limit = 10;
    limit = Number(limit);
    query = query.limit(limit);
    if (!page) page = 1;
    page = Number(page);
    query = query.skip(limit * (page - 1));

    const allResources = await query;

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

export { createResource, getAllResource, getById, updateById, deleteById };
