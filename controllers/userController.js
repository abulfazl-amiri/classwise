import User from "../models/User.js";
import bcrypt from "bcrypt";

const signup = async function (req, res) {
  try {
    if (Array.isArray(req.body)) {
      throw new Error("Multi account creation was detected");
    }
    // get the data
    const { username, password, email } = req.body;

    const foundEmails = await User.find({ email: email });

    // if user exist
    if (foundEmails.length !== 0) {
      throw new Error(`Email is already in use`);
    }

    // hashin the passwords
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ username: username, email: email, password: hashedPassword });
    res.status(200).json({
      status: "success",
      data: {
        message: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
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
