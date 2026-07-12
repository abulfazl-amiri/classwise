import * as inviteRepository from "./invite.repository.js";
import QueryBuilder from "../../../utils/query.util.js";
import AppError from "../../../utils/error.util.js";
import * as courseRepository from "../course.repository.js";
import { ensureTeacherCourseLimit } from "../course.service.js";

//

const create = async function ({ senderId, recieverId, courseId }) {
  return await inviteRepository.create({ senderId, recieverId, courseId });
};

const getAll = async function ({ userId }, queryString) {
  const query = new QueryBuilder(inviteRepository.buildQuery({ recieverId: userId }), queryString)
    .filter()
    .sort()
    .select()
    .paginate();
  return await query.execute();
};

const getOne = async function ({ id, userId }) {
  let invite = await inviteRepository.findByIdAndRecieverId(id, userId);
  if (!invite) throw new AppError("Invite not found", 404);
  return invite;
};

const accept = async function ({ id, userId }) {
  const invite = await inviteRepository.findByIdAndRecieverId(id, userId);
  if (!invite) throw new AppError("Invite not found", 404);
  if (invite.status !== "pending") throw new AppError("Invite is not pending", 400);
  if (invite.expiresAt <= new Date()) throw new AppError("Invite is expired", 400);

  await ensureTeacherCourseLimit(userId);

  await courseRepository.addTeacher({ id: invite.course, teacherId: userId });

  return await inviteRepository.findOneAndAccept({ id, recieverId: userId });
};

const reject = async function ({ id, userId }) {
  return await inviteRepository.findOneAndReject({ id, recieverId: userId });
};

export { create, getAll, getOne, accept, reject };
