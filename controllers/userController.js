import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const isProvided = function (...fields) {
  for (let field of fields) {
    if (!field) return false;
  }
  return true;
};

const createJWTToken = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async function (req, res) {
  try {
    if (Array.isArray(req.body)) {
      throw new Error("Multi account creation was detected");
    }
    // get the data
    const { username, password, email } = req.body;
    if (!isProvided(username, email, password)) {
      res.status(400).json({
        status: "fail",
        message: "Email, username or Password is missing.",
      });
      return;
    }

    const foundEmail = await User.findOne({ email: email });

    // if user exist
    if (foundEmail) {
      res.status(409).json({
        status: "fail",
        message: "Email is already in use",
      });
      return;
    }

    // hashin the passwords
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ username: username, email: email, password: hashedPassword });

    // create the token
    const token = createJWTToken(user._id);

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
      throw new Error("Multi account sign in was detected");
    }
    const { email, password } = req.body;
    if (!isProvided(email, password)) {
      res.status(400).json({
        status: "fail",
        message: "Email or Password is missing.",
      });
      return;
    }
    const foundUser = await User.findOne({ email: email });

    // user did not find
    if (!foundUser) {
      res.status(401).json({
        status: "fail",
        message: "Email or password was incorrect",
      });
      return;
    }

    // checks the password
    const passMatches = await bcrypt.compare(password, foundUser.password);
    if (!passMatches) {
      res.status(401).json({
        status: "fail",
        message: "Email or password was incorrect",
      });
      return;
    }

    // create token
    const token = createJWTToken(foundUser._id);

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
