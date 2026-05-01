import Class from "./../models/Class.js";

//// CRUD

const createClass = async (req, res) => {
  try {
    // filtering for _id and __v
    if (Array.isArray(req.body)) {
      const classes = { ...req.body };
      classes.forEach((cls) => {
        delete cls["_id"];
        delete cls["__v"];
      });
    } else {
      delete classes["_id"];
      delete classes["__v"];
    }
    const createdClasses = await Class.create(classes);
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
      message: err,
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({});
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
      message: err,
    });
  }
};

const getClassById = async (req, res) => {
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
      message: err,
    });
  }
};

const updateClass = async (req, res) => {
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
      message: err,
    });
  }
};

const deleteClass = async (req, res) => {
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
      message: err,
    });
  }
};

export { createClass, getAllClasses, getClassById, updateClass, deleteClass };
