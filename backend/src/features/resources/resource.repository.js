import Resource from "./resource.model.js";

const create = async function (data) {
  return await Resource.create(data);
};

const findAll = async function (filter) {
  return await Resource.find({ teacher: filter.teacher });
};

const buildQuery = function (filter) {
  return Resource.find(filter);
};

const findOne = async function (filter) {
  return await Resource.findOne({ _id: filter._id, teacher: filter.teacher });
};

const findOneById = async function (id) {
  return await Resource.findById(id);
};

const updateOne = async function (filter, newResource) {
  return await Resource.findOneAndUpdate(
    { _id: filter._id, teacher: filter.teacher },
    newResource,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

const deleteOne = async function (filter) {
  return await Resource.findOneAndDelete({ _id: filter._id, teacher: filter.teacher });
};

export { create, findAll, findOne, findOneById, updateOne, deleteOne, buildQuery };
