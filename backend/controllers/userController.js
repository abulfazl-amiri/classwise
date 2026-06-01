import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import ResetToken from "../models/ResetToken.js";

import appError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import sendEmail from "../utils/email.js";

// Helpers
const isProvided = function (...fields) {
  for (let field of fields) {
    if (!field) return false;
  }
  return true;
};

const generateRefreshToken = async function (userId, res) {
  // sign the refreshToken
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  // save to DB
  await RefreshToken.create({ token: token, user: userId });

  // add it to cookie
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days in milliseconds
  });
};

// handlers

const refreshToken = async function (req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new appError("Refresh Token is missing", 401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const token = await RefreshToken.findOne({
      token: refreshToken,
      used: false,
    });
    if (!token) throw new appError("Invalid refresh token.", 401);

    const user = await User.findById(token.user);
    if (!user) throw new appError("User not found", 404);

    await generateRefreshToken(user.id, res);
    const accessToken = user.createToken();

    token.used = true;
    await token.save();

    res.status(200).json({
      status: "success",
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
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

    const user = await User.create({
      username: username,
      email: email,
      password: password,
      role: "user",
    });

    // create the token
    const accessToken = user.createToken();
    const refreshToken = await generateRefreshToken(user._id, res);

    res.status(200).json({
      status: "success",
      token: accessToken,
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

    const accessToken = foundUser.createToken();
    const refreshToken = await generateRefreshToken(foundUser._id, res);

    res.status(200).json({
      status: "success",
      token: accessToken,
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

const updateUserRole = async function (req, res, next) {
  try {
    const { role } = req.body;
    if (!role) throw new appError("role is missing", 422);
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { role: role },
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

const updateUserPassword = async function (req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) throw new appError("User not found, please login again", 401);

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

const forgotPassword = async function (req, res, next) {
  try {
    // same response for both case to avoid existing or not leakage
    const respond = function () {
      res.status(200).json({
        status: "success",
        message: "Check your inbox for a reset link",
      });
    };

    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return respond();

    // token
    const token = crypto.randomBytes(32).toString("hex");

    await ResetToken.create({
      token: token,
      user: user.id,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 min later
    });

    await sendEmail({
      to: user.email,
      subject: "Reset password",
      message:
        "Your password reset link for classwise is:" +
        `\n${process.env.CLIENT_URL}/reset-password/${token}\n` +
        "Please don't share it with anyone",
    });

    respond();
  } catch (err) {
    next(err);
  }
};

const resetPassword = async function (req, res, next) {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
    if (!resetToken) throw new appError("Reset token is missing", 422);
    if (!newPassword) throw new appError("newPassword is missing", 422);

    const token = await ResetToken.findOne({
      token: resetToken,
      used: false,
      expiresAt: { $gt: Date.now() },
    });
    if (!token) throw new appError("Invalid token", 401);

    const user = await User.findById(token.user);
    if (!user) throw new appError("User not found", 404);
    user.password = newPassword;
    await user.save();

    token.used = true;
    await token.save();

    await generateRefreshToken(user.id, res);
    const accessToken = user.createToken();

    res.status(200).json({
      status: "success",
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export {
  refreshToken,
  signup,
  signin,
  getAllUsers,
  getById,
  updateById,
  deleteById,
  updateUserRole,
  updateUserPassword,
  forgotPassword,
  resetPassword,
};
