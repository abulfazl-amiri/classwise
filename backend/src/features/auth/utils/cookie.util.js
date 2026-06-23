import { parseToMs } from "../../../utils/parser.util.js";

const COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: "strict" };

const setCookie = function ({ name, value, maxAge, res }) {
  res.cookie(name, value, { ...COOKIE_OPTIONS, maxAge });
};

// interfaces
const setRefreshTokenCookie = function (refreshToken, res) {
  setCookie({
    name: "refreshToken",
    value: refreshToken,
    maxAge: parseToMs(process.env.REFRESH_TOKEN_EXPIRES_IN),
    res: res,
  });
};

const setSudoTokenCookie = function (sudoToken, res) {
  setCookie({
    name: "sudoToken",
    value: sudoToken,
    maxAge: parseToMs(process.env.SUDO_TOKEN_EXPIRES_IN),
    res: res,
  });
};

const removeCookie = function (name, res) {
  res.clearCookie(name);
};
export { setRefreshTokenCookie, setSudoTokenCookie, removeCookie };
