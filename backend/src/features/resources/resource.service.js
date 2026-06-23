import * as resourceRepository from "./resource.repository.js";
import AppError from "../../utils/error.util.js";

const create = async function (data) {
  return await resourceRepository.create(data);
};

const getAll = async function (filter) {
  return await resourceRepository.findAll(filter);
};

const getFilteredResources = async function (userId) {};

const getOne = async function (filter) {
  const resource = await resourceRepository.findOne(filter);
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
