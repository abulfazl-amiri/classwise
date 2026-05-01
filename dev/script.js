import mongoose from "mongoose";
import dotenv from "dotenv/config.js";
import express from "express";
import Class from "../models/Class.js";

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed: ", err);
}

// DELETE ALL DATA FROM DB
const deleteAllData = async function () {
  try {
    await Class.deleteMany({}); // {}: match all documents in the collection
    console.log("All the data deleted successfully");
  } catch (err) {
    console.err(err);
  }
};

if (process.argv[2] === "--delete" || process.argv[2] === "-d") {
  await deleteAllData();
  process.exit();
}
