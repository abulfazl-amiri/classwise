import crypto from "node:crypto";

import jwt from "jsonwebtoken";

const generateToken = function (payload, secretKey, expiresIn) {
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn,
  });
};

/**
 * Signs a JWT token
 * @param {*} userId
 * @returns
 */
const signAccessToken = function (userId) {
  return generateToken(
    { sub: userId.toString() },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN,
  );
};

const generateRefreshToken = function () {
  return crypto.randomBytes(32).toString("hex");
};
const generateResetToken = function () {
  return crypto.randomBytes(32).toString("hex");
};
const generateSudoToken = function () {
  return crypto.randomBytes(32).toString("hex");
};

const hashToken = function (rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};

const verifyAccessToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export {
  signAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyAccessToken,
  hashToken,
  generateSudoToken,
};
