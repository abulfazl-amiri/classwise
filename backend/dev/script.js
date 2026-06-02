import mongoose from "mongoose";
import dotenv from "dotenv/config.js";
import express from "express";

import Class from "../models/Class.js";
import Resource from "../models/Resource.js";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import ResetToken from "../models/ResetToken.js";

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed: ", err);
}

// DELETE ALL DATA FROM DB

const deleteAllClasses = async function () {
  try {
    await Class.deleteMany({}); // {}: match all documents in the collection
    console.log("All the classes deleted successfully");
  } catch (err) {
    console.err(err);
  }
};

const deleteAllResources = async function () {
  try {
    await Resource.deleteMany({}); // {}: match all documents in the collection
    console.log("All the resources deleted successfully");
  } catch (err) {
    console.err(err);
  }
};

const deleteAllUsers = async function () {
  try {
    await User.deleteMany({}); // {}: match all documents in the collection
    console.log("All the users deleted successfully");
  } catch (err) {
    console.error(err);
  }
};

const deleteAllRefreshTokens = async function () {
  try {
    await RefreshToken.deleteMany({});
    console.log("All refresh tokens deleted successfully");
  } catch (err) {
    console.error(err);
  }
};

const deleteAllResetTokens = async function () {
  try {
    await ResetToken.deleteMany({});
    console.log("All reset tokens deleted successfully");
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "--delete") {
  switch (process.argv[3]) {
    case "--users":
      await deleteAllUsers();
      break;
    case "--resettokens":
      await deleteAllResetTokens();
      break;
    case "--refreshtokens":
      await deleteAllRefreshTokens();
      break;
    case "--classes":
      await deleteAllClasses();
      break;
    case "--resources":
      await deleteAllResources();
      break;
    default:
      console.log(
        "Invalid option. use --users | --resettokens | --refreshtokens | --classes | --resources",
      );
  }
  process.exit(0);
}
process.exit(1);
