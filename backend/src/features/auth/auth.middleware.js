import AppError from "../../utils/error.util.js";

const requireRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AppError("Refresh token must be provided in the cookies", 401);

  next();
};

export { requireRefreshToken };
