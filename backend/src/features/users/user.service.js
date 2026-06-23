import AppError from "../../utils/error.util.js";

import * as userRepository from "./user.repository.js";
import * as passwordUtils from "../../utils/password.util.js";
import * as sessionService from "../sessions/session.service.js";

// services
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

const resetPassword = async function (userId, password) {
  await userRepository.updatePassword(userId, passwordUtils.hash(password));
};

const userExist = async function (email) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;
  return user;
};

const getAll = async function (filter) {
  return await userRepository.findAll(filter);
};

const getById = async function (userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  return user;
};

const updateById = async function (userId, { email }) {
  const user = await userRepository.updateById(userId, {
    email,
  });
  if (!user) throw new AppError("User not found", 404);

  return user;
};

const deleteById = async function (userId) {
  const user = await userRepository.deleteById(userId);
  if (!user) throw new AppError("User not found", 404);

  return user;
};

const updateRole = async function (userId, role) {
  const user = await userRepository.updateRole(userId, role);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const changePassword = async function ({ userId, oldPassword, newPassword }) {
  const user = await userRepository.findById(userId);
  const updateduser = await verifyPassword(user.email, oldPassword);
  if (!updateduser) throw new AppError("Old password was incorrect");

  await userRepository.updatePassword(updateduser._id, passwordUtils.hash(newPassword));
  await sessionService.revokeAll(updateduser._id);
};
export {
  createUser,
  verifyPassword,
  resetPassword,
  changePassword,
  userExist,
  getAll,
  getById,
  updateById,
  deleteById,
  updateRole,
};
