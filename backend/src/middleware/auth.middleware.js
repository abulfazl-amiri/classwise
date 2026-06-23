import AppError from "../utils/error.util.js";
import { verifyAccessToken, hashToken } from "../utils/token.util.js";
import * as userRepository from "../features/users/user.repository.js";

import redis from "../config/redis.js";

const authenticate = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError("Authorization header is missing", 401);

    const [scheme, accessToken] = authHeader.split(" ");

    if (authHeader.split(" ").length !== 2 || !scheme) {
      throw new AppError("Malformed token is provided", 401);
    }
    if (!accessToken) throw new AppError("Token is missing.", 401);

    const decoded = verifyAccessToken(accessToken);
    const currentUser = await userRepository.findById(decoded.sub);
    if (!currentUser) {
      throw new AppError("User not found", 401);
    }
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

const requireRole = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
};
const requireSudoMode = async function (req, res, next) {
  const { sudoToken } = req.cookies;
  if (!sudoToken) return next(new AppError("Sudo mode required", 403));

  const userId = await redis.get(`sudo:${hashToken(sudoToken)}`);
  if (!userId) return next(new AppError("Sudo mode expired, please confirm your password", 403));

  if (userId !== req.user._id.toString()) {
    return next(new AppError("Sudo mode expired, please confirm your password", 403));
  }

  next();
};

// REUSE the logic in userController handlers
const setMeId = function (req, res, next) {
  req.params.id = req.user._id;
  next();
};

export { authenticate, requireRole, setMeId, requireSudoMode };
