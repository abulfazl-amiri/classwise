import User from "./user.model.js";

import AppError from "../../utils/error.util.js";
import APIFeatures from "../../utils/query.util.js";

import { signAccessToken } from "../../utils/token.util.js";

import * as userService from "./user.service.js";

const getAllUsers = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : { ...req.query };

    const features = new APIFeatures(userService.getAll({}), queryString)
      .filter()
      .sort()
      .select()
      .paginate();
    const users = await features.query;
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
    const user = await userService.getById(req.params.id);
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
    const { updatedUser } = await userService.updateById(req.params.id, req.body);

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
    await userService.deleteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async function (req, res, next) {
  try {
    const updatedUser = await userService.updateRole(req.params.id, req.body.role);
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

const changePassword = async function (req, res, next) {
  try {
    await userService.changePassword({ userId: req.user._id, ...req.body });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { getAllUsers, getById, updateById, deleteById, updateUserRole, changePassword };
