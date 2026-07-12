import ResourceAccess from "./resourceAccess.model.js";

const create = async function (data) {
  return await ResourceAccess.create(data);
};

const findByResourceAndTeacher = async function ({ resourceId, teacherId }) {
  return await ResourceAccess.findOne({
    resource: resourceId,
    teacher: teacherId,
    status: "active",
  });
};

const findAllByResource = async function (resourceId) {
  return await ResourceAccess.find({ resource: resourceId, status: "active" })
    .populate("teacher", "_id name email")
    .populate("grantedBy", "_id name email");
};

const findResourceIdsByTeacher = async function (teacherId) {
  return await ResourceAccess.distinct("resource", { teacher: teacherId, status: "active" });
};

const revoke = async function ({ resourceId, teacherId }) {
  return await ResourceAccess.findOneAndUpdate(
    { resource: resourceId, teacher: teacherId, status: "active" },
    { status: "revoked" },
    { returnDocument: "after", runValidators: true },
  );
};

export { create, findByResourceAndTeacher, findAllByResource, findResourceIdsByTeacher, revoke };
