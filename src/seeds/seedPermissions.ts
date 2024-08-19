import mongoose from "mongoose";
import { mPermission } from "../models/mongoschema";

async function seedPermissions() {
  await mongoose.connect("mongodb://localhost:27017/yourdb");

  const permissions = [
    { name: "read_intern", description: "Permission to read intern details" },
    { name: "create_intern", description: "Permission to create intern" },
    { name: "update_intern", description: "Permission to update intern" },
    { name: "delete_intern", description: "Permission to delete intern" },
    { name: "read_mentor", description: "Permission to read mentor details" },
    { name: "update_mentor", description: "Permission to update mentor" },
    { name: "delete_mentor", description: "Permission to delete mentor" },
    { name: "manage_roles", description: "Permission to manage roles" },
  ];

  await mPermission.insertMany(permissions);

  console.log("Permissions have been seeded successfully!");
  await mongoose.disconnect();
}

seedPermissions().catch((err) => console.error(err));
