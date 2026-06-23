import Resource from "./resource.model.js";

const create = async function (data) {
  return await Resource.create(data);
};

const findAll = async function (filter) {
  return await Resource.find({ user: filter.user });
};

const buildQuery = async function (filter) {
  return Resource.find(filter);
};
const findOne = async function (filter) {
  return await Resource.findOne({ _id: filter._id, user: filter.user });
};

const updateOne = async function (filter, newResource) {
  return await Resource.findOneAndUpdate({ _id: filter._id, user: filter.user }, newResource, {
    returnDocument: "after",
    runValidators: true,
  });
};
const deleteOne = async function (filter) {
  return await Resource.findOneAndDelete({ _id: filter._id, user: filter.user });
};

export { create, findAll, findOne, updateOne, deleteOne, buildQuery };
