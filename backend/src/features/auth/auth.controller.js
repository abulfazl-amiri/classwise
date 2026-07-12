import * as authService from "./auth.service.js";
import * as cookieUtils from "./utils/cookie.util.js";

const signup = async function (req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.signup({
      ...req.body,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    cookieUtils.setRefreshTokenCookie(refreshToken, res);

    res.status(200).json({
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

const signin = async function (req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.signin({
      ...req.body,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    cookieUtils.setRefreshTokenCookie(refreshToken, res);

    res.status(200).json({
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async function (req, res, next) {
  try {
    const { refreshToken, accessToken } = await authService.refresh({
      ...req.cookies,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    cookieUtils.setRefreshTokenCookie(refreshToken, res);

    res.status(200).json({
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

const logout = async function (req, res, next) {
  try {
    await authService.logout(req.cookies.refreshToken);
    cookieUtils.removeCookie("refreshToken", res);
    cookieUtils.removeCookie("sudoToken", res);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async function (req, res, next) {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      message: "Check your inbox for a reset link",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async function (req, res, next) {
  try {
    await authService.resetPassword(req.body.resetToken, req.body.newPassword);

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
};

const confirmPassword = async function (req, res, next) {
  try {
    const sudoToken = await authService.confirmPassword({
      email: req.user.email,
      password: req.body.password,
    });
    cookieUtils.setSudoTokenCookie(sudoToken, res);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
export { signup, signin, refresh, logout, forgotPassword, resetPassword, confirmPassword };
