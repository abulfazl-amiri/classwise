import Class from "./class.model.js";

const create = async function (data) {
  return await Class.create(data);
};

const findOne = async function (filter) {
  return await Class.findOne(filter);
};

const findAll = async function (filter) {
  return await Class.find({ user: filter.user });
};

const updateOne = async function (filter, newcls) {
  return await Class.findOneAndUpdate({ _id: filter._id, user: filter.user }, newcls, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteOne = async function (filter) {
  return await Class.findOneAndDelete({ _id: filter._id, user: filter.user });
};

export { create, findOne, findAll, updateOne, deleteOne };
