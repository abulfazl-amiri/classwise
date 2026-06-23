import User from "./user.model.js";

const create = async function (data) {
  return await User.create(data);
};

const findByEmail = async function (email, selectPasswordHash = false) {
  if (!selectPasswordHash) {
    return await User.findOne({ email: email });
  }
  return await User.findOne({ email: email }).select("+passwordHash");
};

const findOne = async function (filter) {
  return await User.findOne(filter);
};

const findAll = async function (filter) {
  return await User.find(filter);
};

const findById = async function (userId) {
  return await User.findById(userId);
};

const updateById = async function (userId, data) {
  return await User.findOneAndUpdate({ _id: userId }, data, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteById = async function (userId) {
  return await User.findOneAndDelete({ _id: userId });
};

const updatePassword = async function (userId, passwordHash) {
  return await User.findOneAndUpdate(
    { _id: userId },
    { passwordHash: passwordHash },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

const updateRole = async function (userId, role) {
  return await User.findOneAndUpdate(
    { id: userId },
    { role: role },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export {
  create,
  findOne,
  findByEmail,
  findById,
  updateById,
  deleteById,
  updatePassword,
  findAll,
  updateRole,
};
