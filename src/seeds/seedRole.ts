import mongoose from "mongoose";
import { mRole } from "../models/mongoschema";

async function seedRoles() {
  await mongoose.connect("mongodb://localhost:27017/authorization");

  const roles = [
    { name: "intern", description: "Intern role" },
    { name: "mentor", description: "Mentor role" },
    { name: "admin", description: "Admin role" },
  ];

  await mRole.insertMany(roles);

  console.log("Roles have been seeded successfully!");
  await mongoose.disconnect();
}

seedRoles().catch((err) => console.error(err));
