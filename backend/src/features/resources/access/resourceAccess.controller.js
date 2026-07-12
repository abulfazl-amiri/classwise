import * as resourceAccessService from "./resourceAccess.service.js";

const grantAccess = async function (req, res, next) {
  try {
    const access = await resourceAccessService.grantAccess({
      resourceId: req.params.resourceId,
      teacherId: req.body.teacherId,
      grantedById: req.user._id,
    });

    res.status(201).json(access);
  } catch (err) {
    next(err);
  }
};

const listAccess = async function (req, res, next) {
  try {
    const accessList = await resourceAccessService.listAccess({
      resourceId: req.params.resourceId,
      userId: req.user._id,
    });

    res.status(200).json({
      results: accessList.length,
      data: accessList,
    });
  } catch (err) {
    next(err);
  }
};

const revokeAccess = async function (req, res, next) {
  try {
    await resourceAccessService.revokeAccess({
      resourceId: req.params.resourceId,
      teacherId: req.params.teacherId,
      userId: req.user._id,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export { grantAccess, listAccess, revokeAccess };
