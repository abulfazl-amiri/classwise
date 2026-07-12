import User from "./user.model.js";

const buildQuery = function ({ name } = {}) {
  const query = {};
  if (name) query.name = name;
  return User.find(query);
};

const create = async function (dto) {
  return await User.create(dto);
};

const findByEmail = async function (email, selectPasswordHash = false) {
  if (!selectPasswordHash) {
    return await User.findOne({ email: email });
  }
  return await User.findOne({ email: email }).select("+passwordHash");
};

const findById = async function (id) {
  return await User.findById(id);
};

const updateById = async function (id, dto) {
  return await User.findOneAndUpdate({ _id: id }, dto, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteById = async function (id) {
  return await User.findOneAndDelete({ _id: id });
};

const updatePassword = async function (id, passwordHash) {
  return await User.findOneAndUpdate(
    { _id: id },
    { passwordHash: passwordHash },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

const updateRole = async function (id, role) {
  return await User.findOneAndUpdate(
    { _id: id },
    { role: role },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export {
  create,
  findByEmail,
  findById,
  updateById,
  deleteById,
  updatePassword,
  updateRole,
  buildQuery,
};
