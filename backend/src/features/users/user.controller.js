import * as userService from "./user.service.js";

const getAll = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...req.query, ...res.locals.queryOverrides }
      : { ...req.query };
    const users = await userService.getFilteredUsers(queryString);

    res.status(200).json({
      results: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

const getById = async function (req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateById = async function (req, res, next) {
  try {
    const user = await userService.updateById(req.params.id, req.body);

    res.status(200).json(user);
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
    const user = await userService.updateRole(req.params.id, req.body.role);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async function (req, res, next) {
  try {
    await userService.changePassword(req.user.id, {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { getAll, getById, updateById, deleteById, updateUserRole, changePassword };
