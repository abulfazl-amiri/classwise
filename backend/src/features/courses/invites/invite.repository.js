import Invite from "./invite.model.js";
import * as inviteConstants from "./invite.constants.js";
import { parseToMs } from "../../../utils/parser.util.js";

const buildQuery = function ({ recieverId } = {}) {
  const query = {};
  if (recieverId) query.reciever = recieverId;
  return Invite.find(query);
};
//

const create = async function ({ senderId, recieverId, courseId }) {
  const dto = {
    sender: senderId,
    reciever: recieverId,
    course: courseId,
    expiresAt: new Date(Date.now() + parseToMs(inviteConstants.INVITE_EXPIRES_IN)),
  };
  return await Invite.create(dto);
};

const findByIdAndRecieverId = async function (id, recieverId) {
  return await Invite.findOne({ _id: id, reciever: recieverId });
};

const findOneAndReject = async function ({ id, recieverId }) {
  return await Invite.findOneAndUpdate(
    { _id: id, reciever: recieverId },
    { status: "rejected" },
    { returnDocument: "after", runValidators: true },
  );
};
const findOneAndAccept = async function ({ id, recieverId }) {
  return await Invite.findOneAndUpdate(
    { _id: id, reciever: recieverId },
    { status: "accepted" },
    { returnDocument: "after", runValidators: true },
  );
};

export { findByIdAndRecieverId, buildQuery, create, findOneAndAccept, findOneAndReject };
