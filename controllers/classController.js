import Class from "./../models/Class.js";

const createClass = async (req, res) => {
  try {
    const createdClass = await Class.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        classes: createdClass,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export { createClass };
