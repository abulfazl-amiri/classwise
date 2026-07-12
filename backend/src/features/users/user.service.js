import AppError from "../../utils/error.util.js";

import * as userRepository from "./user.repository.js";
import * as passwordUtils from "../../utils/password.util.js";
import * as sessionService from "../sessions/session.service.js";
import QueryBuilder from "../../utils/query.util.js";

// utils
const createUser = async function ({ email, password }) {
  return await userRepository.create({
    email: email,
    passwordHash: await passwordUtils.hash(password),
  });
};

const verifyPassword = async function (email, password) {
  const user = await userRepository.findByEmail(email, true);
  if (!user) return;

  const isMatcth = await passwordUtils.compare(password, user.passwordHash);
  if (!isMatcth) return;

  return user;
};

const resetPassword = async function (id, password) {
  await userRepository.updatePassword(id, await passwordUtils.hash(password));
};

const userExist = async function (email) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;
  return user;
};

/////////////////// services

const getFilteredUsers = async function (queryString) {
  const query = new QueryBuilder(userRepository.buildQuery({}), queryString)
    .filter()
    .sort()
    .select()
    .paginate();
  query.mongooseQuery.select("-passwordHash");
  return await query.execute();
};

const getById = async function (id) {
  const user = await userRepository.findById(id);
  if (!user) throw new AppError("User not found", 404);

  return user;
};

const updateById = async function (id, { email, name }) {
  const user = await userRepository.updateById(id, {
    email,
    name,
  });
  if (!user) throw new AppError("User not found", 404);

  return user;
};

const deleteById = async function (id) {
  const user = await userRepository.deleteById(id);
  if (!user) throw new AppError("User not found", 404);
};

const updateRole = async function (id, role) {
  const user = await userRepository.updateRole(id, role);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const changePassword = async function (id, { oldPassword, newPassword }) {
  const user = await userRepository.findById(id);
  const updateduser = await verifyPassword(user.email, oldPassword);
  if (!updateduser) throw new AppError("Old password was incorrect", 401);

  await userRepository.updatePassword(updateduser._id, await passwordUtils.hash(newPassword));
  await sessionService.revokeAll(updateduser._id);
};
export {
  createUser,
  verifyPassword,
  resetPassword,
  changePassword,
  userExist,
  getFilteredUsers,
  getById,
  updateById,
  deleteById,
  updateRole,
};
