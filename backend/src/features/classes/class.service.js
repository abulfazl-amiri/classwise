import * as classRepository from "./class.repository.js";
import AppError from "../../utils/error.util.js";

const create = async function (data) {
  return await classRepository.create(data);
};

const getAll = async function (filter) {
  return await classRepository.findAll(filter);
};

const getOne = async function (filter) {
  const cls = await classRepository.findOne(filter);
  if (!cls) throw new AppError("Class not found", 404);
  return cls;
};

const updateOne = async function (filter, data) {
  const cls = await classRepository.updateOne(filter, data);
  if (!cls) throw new AppError("Clss not found", 404);
  return cls;
};

const deleteOne = async function (filter) {
  const cls = await classRepository.deleteOne(filter);
  if (!cls) throw new AppError("Class not found", 404);
};
export { create, getAll, getOne, updateOne, deleteOne };
