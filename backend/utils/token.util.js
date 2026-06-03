import jwt from "jsonwebtoken";

const createToken = function (payload, secretKey, expiresIn) {
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn,
  });
};

export { createToken };
