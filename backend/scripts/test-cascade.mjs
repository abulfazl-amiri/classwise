/**
 * Standalone cascade-deletion test.
 *
 * Connects to a THROWAWAY database on the same cluster (never the real one),
 * seeds a full entity graph, deletes parents via findByIdAndDelete (the path
 * the app uses), and asserts every child document is cleaned up. Drops the
 * whole test DB at the end.
 *
 * Run:  node --env-file=.env scripts/test-cascade.mjs
 */
import mongoose from "mongoose";

import User from "../src/features/users/user.model.js";
import Course from "../src/features/courses/course.model.js";
import Resource from "../src/features/resources/resource.model.js";
import Student from "../src/features/students/student.model.js";
import Enrollment from "../src/features/courses/enrollments/enrollment.model.js";
import Lesson from "../src/features/courses/lessons/lesson.model.js";
import Timetable from "../src/features/courses/timetable/timetable.model.js";
import Invite from "../src/features/courses/invites/invite.model.js";
import NonTeachingDay from "../src/features/nonTeachingDays/nonTeachingDay.model.js";
import ResourceAccess from "../src/features/resources/access/resourceAccess.model.js";

// Point at a throwaway DB on the same cluster, regardless of the name in MONGO_URI.
const baseUri = process.env.MONGO_URI;
const testUri = baseUri.replace(/\/([^/?]+)(\?|$)/, "/classwise_cascade_test$2");

let passed = 0;
let failed = 0;
const check = async (label, fn) => {
  const n = await fn();
  const ok = n === 0;
  console.log(`  ${ok ? "✅" : "❌"} ${label}: ${n} leftover`);
  ok ? passed++ : failed++;
};

const oid = () => new mongoose.Types.ObjectId();

async function seedCourseGraph(owner) {
  const resource = await Resource.create({
    teacher: owner._id,
    name: "Book",
    author: "A",
    totalPages: 100,
    totalUnits: 10,
    level: "beginner",
  });
  const course = await Course.create({
    owner: owner._id,
    name: "Math",
    subject: "Math",
    fee: 10,
    currencyCode: "USD",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-06-01"),
    teachers: [owner._id],
  });
  const student = await Student.create({
    createdBy: owner._id,
    firstName: "jane",
    lastName: "doe",
  });
  const enrollment = await Enrollment.create({
    student: student._id,
    course: course._id,
    fee: 10,
    currencyCode: "USD",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-06-01"),
  });
  const lesson = await Lesson.create({
    course: course._id,
    resource: resource._id,
    date: new Date("2026-02-01"),
  });
  const timetable = await Timetable.create({ course: course._id });
  const invite = await Invite.create({
    sender: owner._id,
    reciever: oid(),
    course: course._id,
    expiresAt: new Date("2027-01-01"),
  });

  return { resource, course, student, enrollment, lesson, timetable, invite };
}

async function run() {
  await mongoose.connect(testUri);
  console.log(`Connected to test DB: ${mongoose.connection.name}\n`);
  // Start clean in case a prior run left anything behind.
  await mongoose.connection.dropDatabase();

  // ---- Course cascade ----
  console.log("Course.findByIdAndDelete cascade:");
  {
    const owner = await User.create({ email: `c-${oid()}@t.com`, passwordHash: "x" });
    const g = await seedCourseGraph(owner);
    // non-teaching day shared with a second course: should lose only this course
    const otherCourseId = oid();
    const sharedDay = await NonTeachingDay.create({
      date: new Date("2026-03-01"),
      courses: [g.course._id, otherCourseId],
      reason: "holiday",
    });
    const soloDay = await NonTeachingDay.create({
      date: new Date("2026-03-02"),
      courses: [g.course._id],
      reason: "holiday",
    });

    await Course.findByIdAndDelete(g.course._id);

    await check("lessons", () => Lesson.countDocuments({ course: g.course._id }));
    await check("timetables", () => Timetable.countDocuments({ course: g.course._id }));
    await check("enrollments", () => Enrollment.countDocuments({ course: g.course._id }));
    await check("invites", () => Invite.countDocuments({ course: g.course._id }));
    await check("emptied non-teaching day deleted", () =>
      NonTeachingDay.countDocuments({ _id: soloDay._id }),
    );
    await check("shared day still references only other course", async () => {
      const d = await NonTeachingDay.findById(sharedDay._id);
      const ids = d.courses.map((c) => c.toString());
      return ids.length === 1 && ids[0] === otherCourseId.toString() ? 0 : 1;
    });
  }

  // ---- Resource cascade ----
  console.log("\nResource.findByIdAndDelete cascade:");
  {
    const owner = await User.create({ email: `r-${oid()}@t.com`, passwordHash: "x" });
    const resource = await Resource.create({
      teacher: owner._id,
      name: "Book",
      author: "A",
      totalPages: 100,
      totalUnits: 10,
      level: "beginner",
    });
    const course = await Course.create({
      owner: owner._id,
      name: "M",
      subject: "M",
      fee: 1,
      currencyCode: "USD",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-01"),
      teachers: [owner._id],
    });
    await Lesson.create({ course: course._id, resource: resource._id, date: new Date() });
    await ResourceAccess.create({ resource: resource._id, teacher: oid(), grantedBy: owner._id });

    await Resource.findByIdAndDelete(resource._id);

    await check("resource access", () =>
      ResourceAccess.countDocuments({ resource: resource._id }),
    );
    await check("lessons using resource", () => Lesson.countDocuments({ resource: resource._id }));
  }

  // ---- Student cascade ----
  console.log("\nStudent.findByIdAndDelete cascade:");
  {
    const owner = await User.create({ email: `s-${oid()}@t.com`, passwordHash: "x" });
    const student = await Student.create({
      createdBy: owner._id,
      firstName: "a",
      lastName: "b",
    });
    await Enrollment.create({
      student: student._id,
      course: oid(),
      fee: 1,
      currencyCode: "USD",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-01"),
    });

    await Student.findByIdAndDelete(student._id);

    await check("enrollments", () => Enrollment.countDocuments({ student: student._id }));
  }

  // ---- User cascade (the critical one: nested cascades must fire) ----
  console.log("\nUser.findByIdAndDelete cascade (deep):");
  {
    const owner = await User.create({ email: `u-${oid()}@t.com`, passwordHash: "x" });
    const g = await seedCourseGraph(owner);
    // invite where the user is the receiver, tied to some other course
    await Invite.create({
      sender: oid(),
      reciever: owner._id,
      course: oid(),
      expiresAt: new Date("2027-01-01"),
    });
    await ResourceAccess.create({
      resource: g.resource._id,
      teacher: oid(),
      grantedBy: owner._id,
    });

    await User.findByIdAndDelete(owner._id);

    await check("owned courses", () => Course.countDocuments({ owner: owner._id }));
    await check("owned resources", () => Resource.countDocuments({ teacher: owner._id }));
    await check("owned students", () => Student.countDocuments({ createdBy: owner._id }));
    // deep: children of the owned course must be gone too (nested hook fired)
    await check("course's lessons (nested)", () =>
      Lesson.countDocuments({ course: g.course._id }),
    );
    await check("course's enrollments (nested)", () =>
      Enrollment.countDocuments({ course: g.course._id }),
    );
    await check("course's timetable (nested)", () =>
      Timetable.countDocuments({ course: g.course._id }),
    );
    // deep: children of the owned resource must be gone too
    await check("resource's access rows (nested)", () =>
      ResourceAccess.countDocuments({ resource: g.resource._id }),
    );
    // deep: student's enrollments gone via nested student hook
    await check("student's enrollments (nested)", () =>
      Enrollment.countDocuments({ student: g.student._id }),
    );
    await check("invites sent or received", () =>
      Invite.countDocuments({ $or: [{ sender: owner._id }, { reciever: owner._id }] }),
    );
  }

  console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}  (${passed} passed, ${failed} failed)`);

  await mongoose.connection.dropDatabase();
  console.log("Dropped test DB.");
  await mongoose.disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(async (err) => {
  console.error("Test run error:", err);
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
