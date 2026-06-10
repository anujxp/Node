const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Course = require("../models/Course");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ DB connected for seeding");
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Course.deleteMany({});

  const password = await bcrypt.hash("password123", 10);

  // Create Admin
  const admin = await User.create({
    name: "Super Admin",
    email: "admin@school.com",
    password,
    role: "admin",
  });

  // Create Teachers
  const teacher1 = await User.create({
    name: "Dr. Ramesh Kumar",
    email: "ramesh@school.com",
    password,
    role: "teacher",
    subject: "Mathematics",
  });

  const teacher2 = await User.create({
    name: "Prof. Priya Sharma",
    email: "priya@school.com",
    password,
    role: "teacher",
    subject: "Computer Science",
  });

  // Create Students
  const student1 = await User.create({
    name: "Arjun Patel",
    email: "arjun@school.com",
    password,
    role: "student",
    rollNumber: "CS2024001",
    semester: 3,
  });

  const student2 = await User.create({
    name: "Sneha Verma",
    email: "sneha@school.com",
    password,
    role: "student",
    rollNumber: "CS2024002",
    semester: 3,
  });

  const student3 = await User.create({
    name: "Rahul Singh",
    email: "rahul@school.com",
    password,
    role: "student",
    rollNumber: "CS2024003",
    semester: 5,
  });

  // Create Courses
  await Course.create([
    {
      name: "Advanced Mathematics",
      code: "MATH301",
      description: "Calculus, Linear Algebra, and Differential Equations",
      teacher: teacher1._id,
      students: [student1._id, student2._id],
      credits: 4,
    },
    {
      name: "Data Structures & Algorithms",
      code: "CS201",
      description: "Arrays, Trees, Graphs, and Sorting Algorithms",
      teacher: teacher2._id,
      students: [student1._id, student2._id, student3._id],
      credits: 4,
    },
    {
      name: "Web Development",
      code: "CS401",
      description: "HTML, CSS, JavaScript, React, Node.js",
      teacher: teacher2._id,
      students: [student3._id],
      credits: 3,
    },
  ]);

  console.log("\n🌱 Seed data created successfully!\n");
  console.log("─────────────────────────────────────");
  console.log("Login Credentials (password: password123)");
  console.log("─────────────────────────────────────");
  console.log("👑 Admin:   admin@school.com");
  console.log("👨‍🏫 Teacher: ramesh@school.com / priya@school.com");
  console.log("👨‍🎓 Student: arjun@school.com / sneha@school.com / rahul@school.com");
  console.log("─────────────────────────────────────\n");

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
