import AppError from "../../../utils/error.util.js";
import * as resourceRepository from "../resource.repository.js";
import * as userRepository from "../../users/user.repository.js";
import * as resourceAccessRepository from "./resourceAccess.repository.js";

const grantAccess = async function ({ resourceId, teacherId, grantedById }) {
  const resource = await resourceRepository.findOneById(resourceId);
  if (!resource) throw new AppError("Resource not found", 404);

  if (resource.teacher.toString() !== grantedById.toString()) {
    throw new AppError("You do not have permission to share this resource", 403);
  }

  const teacher = await userRepository.findById(teacherId);
  if (!teacher) throw new AppError("Teacher not found", 404);

  const existingAccess = await resourceAccessRepository.findByResourceAndTeacher({
    resourceId,
    teacherId,
  });

  if (existingAccess) {
    throw new AppError("This teacher already has access to this resource", 409);
  }

  return await resourceAccessRepository.create({
    resource: resourceId,
    teacher: teacherId,
    grantedBy: grantedById,
  });
};

const listAccess = async function ({ resourceId, userId }) {
  const resource = await resourceRepository.findOneById(resourceId);
  if (!resource) throw new AppError("Resource not found", 404);

  if (resource.teacher.toString() !== userId.toString()) {
    throw new AppError("You do not have permission to view this resource access", 403);
  }

  return await resourceAccessRepository.findAllByResource(resourceId);
};

const revokeAccess = async function ({ resourceId, teacherId, userId }) {
  const resource = await resourceRepository.findOneById(resourceId);
  if (!resource) throw new AppError("Resource not found", 404);

  if (resource.teacher.toString() !== userId.toString()) {
    throw new AppError("You do not have permission to revoke access from this resource", 403);
  }

  const revokedAccess = await resourceAccessRepository.revoke({ resourceId, teacherId });
  if (!revokedAccess) {
    throw new AppError("Access not found", 404);
  }

  return revokedAccess;
};

export { grantAccess, listAccess, revokeAccess };
