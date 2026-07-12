import * as inviteService from "./invite.service.js";

const create = async function (req, res, next) {
  try {
    const invite = await inviteService.create({
      senderId: req.user.id,
      recieverId: req.body.recieverId,
      courseId: req.params.courseId,
    });
    res.status(201).json(invite);
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const queryString = res.locals.queryOverrides
      ? { ...res.locals.queryOverrides, ...req.query }
      : req.query;
    const invites = await inviteService.getAll({ userId: req.user.id }, queryString);
    res.status(200).json({
      results: invites.length,
      data: invites,
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async function (req, res, next) {
  try {
    const invite = await inviteService.getOne({ id: req.params.id, userId: req.user.id });
    res.status(200).json(invite);
  } catch (err) {
    next(err);
  }
};
const accept = async function (req, res, next) {
  try {
    await inviteService.accept({ id: req.params.id, userId: req.user.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const reject = async function (req, res, next) {
  try {
    await inviteService.reject({ id: req.params.id, userId: req.user.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getOne, accept, reject };
