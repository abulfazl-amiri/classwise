import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    // create the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      data: {
        token: token,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const signin = async function (req, res) {
  try {
    if (Array.isArray(req.body)) {
      throw new Error("Multi account sing in was detected");
    }
    const { email, password } = req.body;
    let foundUser = await User.find({ email: email });

    // check fi account exit
    if (foundUser.length !== 1) {
      res.status(401).json({
        status: "fail",
        message: "Email or password was incorrect",
      });
      return;
    }

    // checks the password
    const matches = await bcrypt.compare(password, foundUser[0].password);
    if (!matches) {
      res.status(401).json({
        status: "fail",
        message: "Email or password was incorrect",
      });
      return;
    }

    // removing the password
    foundUser[0].password = undefined;

    // create token
    const token = jwt.sign({ id: foundUser[0]._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      data: {
        token: token,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export { signup, signin };
