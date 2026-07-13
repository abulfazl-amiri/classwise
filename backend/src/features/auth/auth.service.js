import * as userRepository from "../users/user.repository.js";

import redis from "../../config/redis.js";

import * as sessionService from "../sessions/session.service.js";
import * as userService from "../users/user.service.js";
import AppError from "../../utils/error.util.js";

import { generateResetToken, hashToken, generateSudoToken } from "../../utils/token.util.js";

import { sendEmail } from "../../utils/email.util.js";
import { parseToSec } from "../../utils/parser.util.js";

//

const signup = async function ({ email, password, name, ip, userAgent }) {
  const foundEmail = await userRepository.findByEmail(email);
  if (foundEmail) throw new AppError("Email is already in use", 409);

  const user = await userService.createUser({
    name,
    email,
    password,
  });

  return await sessionService.createSession({
    userId: user.id,
    userAgent: userAgent,
    ip: ip,
  });
};

const signin = async function ({ email, password, ip, userAgent }) {
  const user = await userService.verifyPassword(email, password);
  if (!user) throw new AppError("Email or password was incorrect", 401);

  return await sessionService.createSession({
    userId: user.id,
    userAgent: userAgent,
    ip: ip,
  });
};

const refresh = async function ({ refreshToken, ip, userAgent }) {
  const session = await sessionService.validateSession(refreshToken);
  if (!session) throw new AppError("Invalid or expired session", 401);

  const user = await userRepository.findById(session.userId);
  if (!user) throw new AppError("User not found", 404);

  await sessionService.deleteSession(refreshToken);

  return await sessionService.createSession({
    userId: user.id,
    userAgent: userAgent,
    ip: ip,
  });
};

const logout = async function (refreshToken) {
  await sessionService.deleteSession(refreshToken);
};

const forgotPassword = async function (email) {
  const user = await userService.userExist(email);
  if (!user) return;

  const resetToken = generateResetToken();
  const key = `reset:${hashToken(resetToken)}`;

  await redis.set(key, user.id.toString(), "EX", parseToSec(process.env.RESET_TOKEN_EXPIRES_IN));

  await sendEmail({
    to: user.email,
    subject: "Reset password",
    message:
      "Your password reset link for classwise is:" +
      `\n${process.env.CLIENT_URL}/reset-password?token=${resetToken}\n` +
      "Please don't share it with anyone",
  });
};

const resetPassword = async function (resetToken, newPassword) {
  const key = `reset:${hashToken(resetToken)}`;

  const userId = await redis.get(key);
  if (!userId) throw new AppError("Invalid or expired reset token", 401);

  await redis.del(key);

  const user = await userService.getById(userId);

  // update the passwordHash
  await userService.resetPassword(user.id, newPassword);

  await sessionService.revokeAll(user.id);
};

// for creating sudo mode
const confirmPassword = async function ({ email, password }) {
  const user = await userService.verifyPassword(email, password);
  if (!user) throw new AppError("Email or password was incorrect", 401);

  const sudoToken = generateSudoToken();
  const sudoKey = `sudo:${hashToken(sudoToken)}`;
  await redis.set(sudoKey, user.id, "EX", parseToSec(process.env.SUDO_TOKEN_EXPIRES_IN));
  return sudoToken;
};
export { signup, signin, refresh, logout, forgotPassword, resetPassword, confirmPassword };
