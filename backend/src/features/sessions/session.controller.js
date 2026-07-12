import * as sessionService from "./session.service.js";

const getAll = async function (req, res, next) {
  try {
    const sessions = await sessionService.getAll(req.user._id);
    const sessionArray = Array.isArray(sessions) ? sessions : [sessions];
    res.status(200).json({
      results: sessionArray.length,
      data: sessionArray,
    });
  } catch (err) {
    next(err);
  }
};

const revokeAllSessions = async function (req, res, next) {
  try {
    const sessionNum = await sessionService.revokeAllSessions(
      req.user._id,
      req.cookies.refreshToken,
    );
    res.status(200).json({
      message: `${sessionNum} sessions were revoked.`,
    });
  } catch (err) {
    next(err);
  }
};

const getById = async function (req, res, next) {
  try {
    const session = await sessionService.getById(req.params.id);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};
const deleteById = async function (req, res, next) {
  try {
    await sessionService.deleteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
export { revokeAllSessions, getAll, getById, deleteById };
