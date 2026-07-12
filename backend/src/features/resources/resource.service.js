import * as resourceRepository from "./resource.repository.js";
import * as resourceAccessRepository from "./access/resourceAccess.repository.js";
import AppError from "../../utils/error.util.js";
import QueryBuilder from "../../utils/query.util.js";

const create = async function (data) {
  return await resourceRepository.create(data);
};

const getAll = async function (userId, queryString) {
  const sharedResourceIds = await resourceAccessRepository.findResourceIdsByTeacher(userId);
  const query = new QueryBuilder(
    resourceRepository.buildQuery({
      $or: [{ teacher: userId }, { _id: { $in: sharedResourceIds } }],
    }),
    queryString,
  )
    .filter()
    .sort()
    .select()
    .paginate();

  return await query.mongooseQuery;
};

const getOne = async function (filter) {
  let resource = await resourceRepository.findOne(filter);
  if (!resource) {
    const access = await resourceAccessRepository.findByResourceAndTeacher({
      resourceId: filter._id,
      teacherId: filter.teacher,
    });
    if (access) resource = await resourceRepository.findOneById(filter._id);
  }
  if (!resource) throw new AppError("Resource not found", 404);
  return resource;
};

const updateOne = async function (filter, data) {
  const resource = await resourceRepository.updateOne(filter, data);
  if (!resource) throw new AppError("Resource not found", 404);
  return resource;
};

const deleteOne = async function (filter) {
  const resource = await resourceRepository.deleteOne(filter);
  if (!resource) throw new AppError("Resource not found", 404);
};

export { create, getAll, getOne, updateOne, deleteOne };
