import Resource from "../models/Resource.js";

// CRUD
const createResource = async (req, res) => {
  try {
    // filtering for _id and __v to not let client create their own ones
    let resources;
    if (Array.isArray(req.body)) {
      resources = req.body.map((resource) => {
        const { _id, __v, ...rest } = resource;
        resources = rest;
      });
    } else {
      const { _id, __v, ...rest } = req.body;
    }

    const createdResources = await Resource.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        resources: createdResources,
      },
    });
  } catch (err) {
    req.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getAllResource = async (req, res) => {
  try {
    const allResources = await Resource.find({});
    res.status(200).json({
      status: "success",
      data: {
        resources: allResources,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
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
      message: err,
    });
  }
};

const updateById = async (req, res) => {
  try {
    const foundResource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      returnDocuemnt: "after",
      rundValidators: true,
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
      message: err,
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
      message: err,
    });
  }
};

export { createResource, getAllResource, getById, updateById, deleteById };
