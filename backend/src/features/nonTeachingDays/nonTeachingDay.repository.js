import NonTeachingDay from "./nonTeachingDay.model.js";

const buildQuery = function ({ courseIds = [] }) {
  return NonTeachingDay.find({ courses: { $in: courseIds } });
};

const create = async function ({ dto, courseIds }) {
  return await NonTeachingDay.create({ ...dto, courses: courseIds });
};

const getOne = async function ({ id, courseIds }) {
  return await NonTeachingDay.findOne({ _id: id, courses: { $in: courseIds } });
};

const updateOne = async function ({ id, courseIds }, dto) {
  return await NonTeachingDay.findOneAndUpdate({ _id: id, courses: { $in: courseIds } }, dto, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteOne = async function ({ id, courseIds }) {
  return await NonTeachingDay.findOneAndDelete({ _id: id, courses: { $in: courseIds } });
};

export { buildQuery, create, getOne, updateOne, deleteOne };
