import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import appError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

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

const signup = async function (req, res, next) {
  try {
    if (Array.isArray(req.body)) {
      throw new appError("Multi account creation was detected", 400);
    }
    // get the data
    const { username, password, email } = req.body;
    if (!isProvided(username, email, password)) {
      throw new appError("Email, username or Password is missing.", 400);
    }

    const foundEmail = await User.findOne({ email: email });

    // if user exist
    if (foundEmail) {
      throw new appError("Email is already in use", 409);
    }

    // hashin the passwords
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: "user",
    });

    // create the token
    const token = createJWTToken(user._id);

    res.status(200).json({
      status: "success",
      data: {
        token: token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const signin = async function (req, res, next) {
  try {
    if (Array.isArray(req.body)) {
      throw new appError("Multi account sign in was detected", 400);
    }
    const { email, password } = req.body;
    if (!isProvided(email, password)) {
      throw new appError("Email or Password is missing.", 400);
    }
    const foundUser = await User.findOne({ email: email }).select("+password");

    if (!foundUser) {
      throw new appError("Email or password was incorrect", 401);
    }

    // checks the password
    const passMatches = await bcrypt.compare(password, foundUser.password);
    if (!passMatches) {
      throw new appError("Email or password was incorrect", 401);
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
    next(err);
  }
};

const getAllUsers = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : { ...req.query };

    const features = new APIFeatures(User.find({}), queryString)
      .filter()
      .sort()
      .select()
      .paginate();
    const users = await features.query;
    for (let user of users) {
      user.password = undefined;
    }
    res.status(200).json({
      status: "success",
      data: {
        users: users,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getById = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new appError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateById = async function (req, res, next) {
  try {
    const { _id, username, password, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email }, // do not include _id, role or password
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUser) throw new appError("User not found", 404);

    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
  s;
};

const deleteById = async function (req, res, next) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      throw new appError("User not found", 404);
    }
    res.status(204).json({
      status: "success",
      data: {
        user: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { signup, signin, getAllUsers, getById, updateById, deleteById };
