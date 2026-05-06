const signup = function (req, res) {
  try {
    let user;
    // get the data
    const { username, password, email } = req.body;

    res.status(200).json({
      status: "success",
      data: {
        message: "Under Maintainance",
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const signin = function (req, res) {
  try {
    res.status(200).json({
      status: "success",
      data: {
        message: "Under Maintainance",
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export { signup, signin };
