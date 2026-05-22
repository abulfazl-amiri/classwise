import Class from "./../models/Class.js";
import APIFeatures from "./../utils/apiFeatures.js";

import appError from "../utils/appError.js";

//// CRUD

const createClass = async (req, res, next) => {
  try {
    // filtering for _id and __v
    let clss;
    if (Array.isArray(req.body)) {
      clss = req.body.map((cls) => {
        const { _id, __v, ...rest } = cls;
        return rest;
      });
    } else {
      const { _id, __v, ...rest } = req.body;
      clss = rest;
    }

    const createdClasses = await Class.create(clss);
    res.status(201).json({
      status: "success",
      results: createdClasses.length,
      data: {
        classes: createdClasses,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllClasses = async (req, res, next) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const features = new APIFeatures(Class.find({ owner: req.user.id }), queryString)
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

const getById = async (req, res, next) => {
  try {
    const foundClass = await Class.findOne({ _id: req.params.id, owner: req.user.id });
    if (!foundClass) {
      throw new appError("Class not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        class: foundClass,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateById = async (req, res, next) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedClass) {
      throw new appError("Class not found", 404);
    }
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

const deleteById = async (req, res, next) => {
  try {
    const deletedClass = await Class.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deletedClass) {
      res.status(404).json({
        status: "error",
        message: "Class not found",
      });
      return;
    }
    res.status(204).json({
      status: "success",
      data: {
        class: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { createClass, getAllClasses, getById, updateById, deleteById };
