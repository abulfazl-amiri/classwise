import Class from "./../models/Class.js";
import APIFeatures from "./../utils/apiFeatures.js";

//// CRUD

const createClass = async (req, res) => {
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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    let queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : req.query;

    const features = new APIFeatures(Class.find({}), queryString)
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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const foundClass = await Class.findById(req.params.id);
    if (!foundClass) {
      res.status(404).json({
        status: "error",
        message: "Class not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: {
        class: foundClass,
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
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedClass) {
      res.status(404).json({
        status: "error",
        message: "Class not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: {
        class: updatedClass,
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
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export { createClass, getAllClasses, getById, updateById, deleteById };
