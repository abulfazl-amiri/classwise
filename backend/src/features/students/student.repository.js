import Student from "./student.model.js";

const buildQuery = function ({ createdById, firstName, lastName, email, phone } = {}) {
  const query = {};
  if (createdById) query.createdBy = createdById;
  if (firstName) query.firstName = firstName;
  if (lastName) query.lastName = lastName;
  if (email) query.email = email;
  if (phone) query.phone = phone;

  return Student.find(query);
};

const buildQueryByIds = function (ids) {
  return Student.find({ _id: { $in: ids } });
};

const create = async function ({ dto, createdById }) {
  return await Student.create({ ...dto, createdBy: createdById });
};

const findOne = async function ({ id, createdById }) {
  return await Student.findOne({ _id: id, createdBy: createdById });
};

const findById = async function (id) {
  return await Student.findById(id);
};

const updateOne = async function ({ id, createdById }, dto) {
  return await Student.findOneAndUpdate({ _id: id, createdBy: createdById }, dto, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteOne = async function ({ id, createdById }) {
  return await Student.findOneAndDelete({ _id: id, createdBy: createdById });
};

const findEnrollments = async function ({ id }) {
  const result = await Student.findOne({ _id: id }).select("enrollments -_id");
  return result?.enrollments;
};

export { buildQuery, buildQueryByIds, create, findOne, findById, updateOne, deleteOne, findEnrollments };
