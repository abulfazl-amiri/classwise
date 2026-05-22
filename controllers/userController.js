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

    // hashin the passwords done in the Model
    // const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username,
      email: email,
      password: password,
      role: "user",
    });

    // create the token
    const token = user.createToken();

    res.status(200).json({
      status: "success",
      token: token,
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
    const passMatches = await foundUser.comparePassword(password, foundUser.password);
    if (!passMatches) {
      throw new appError("Email or password was incorrect", 401);
    }

    // create token
    const token = foundUser.createToken();

    res.status(200).json({
      status: "success",
      token: token,
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
      results: users.length,
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
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUser) throw new appError("User not found", 404);

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
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

const updateUsreRole = async function (req, res, next) {
  try {
    const { role } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { role: role },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateUserPassword = async function (req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const matches = await user.comparePassword(oldPassword);
    if (!matches) {
      throw new appError("Password is incorrect", 401);
    }

    user.password = newPassword;

    await user.save();

    const token = user.createToken();

    res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export {
  signup,
  signin,
  getAllUsers,
  getById,
  updateById,
  deleteById,
  updateUsreRole,
  updateUserPassword,
};
