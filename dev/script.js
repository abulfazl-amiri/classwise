import mongoose from "mongoose";
import dotenv from "dotenv/config.js";
import express from "express";
import Class from "../models/Class.js";
import Resource from "../models/Resource.js";

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

if (process.argv[2] === "--delete" && process.argv[3] === "--classes") {
  await deleteAllClasses();
  process.exit();
} else if (process.argv[2] === "--delete" && process.argv[3] === "--resources") {
  await deleteAllResources();
  process.exit();
} else if (process.argv[2] === "--delete" && process.argv[3] === "--users") {
  await deleteAllResources();
  process.exit();
} else {
  console.log(
    "Please specify --delete with --resource | --classes | --users to delete all of them from db",
  );
  process.exit();
}
