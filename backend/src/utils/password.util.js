import bcrypt from "bcrypt";

const hash = async function (password) {
  return await bcrypt.hash(password, 12);
};

const compare = async function (password, hash) {
  return await bcrypt.compare(password, hash);
};

export { hash, compare };
