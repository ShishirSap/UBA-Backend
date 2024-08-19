import mongoose from "mongoose";
import { mPermission, mRole, mRolePermission } from "../models/mongoschema";
interface RolePermissionMapping {
  roleId: mongoose.Types.ObjectId;
  permissionId: mongoose.Types.ObjectId | undefined;
}

async function seedRolePermissions() {
  await mongoose.connect("mongodb://localhost:27017/authorization");

  // Fetch all roles and permissions
  const roles = await mRole.find();
  const permissions = await mPermission.find();

  const rolePermissionMappings: RolePermissionMapping[] = [];

  roles.forEach((role) => {
    if (role.name === "intern") {
      rolePermissionMappings.push({
        roleId: role._id as mongoose.Types.ObjectId,
        permissionId: permissions.find((p) => p.name === "create_intern")
          ?._id as mongoose.Types.ObjectId,
      });
    } else if (role.name === "mentor") {
      rolePermissionMappings.push(
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "read_intern")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "update_intern")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "read_mentor")
            ?._id as mongoose.Types.ObjectId,
        },
      );
    } else if (role.name === "admin") {
      rolePermissionMappings.push(
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "read_intern")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "create_intern")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "update_intern")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "delete_intern")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "read_mentor")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "update_mentor")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "delete_mentor")
            ?._id as mongoose.Types.ObjectId,
        },
        {
          roleId: role._id as mongoose.Types.ObjectId,
          permissionId: permissions.find((p) => p.name === "manage_roles")
            ?._id as mongoose.Types.ObjectId,
        },
      );
    }
  });

  await mRolePermission.insertMany(rolePermissionMappings);

  console.log("Role permissions have been seeded successfully!");
  await mongoose.disconnect();
}

seedRolePermissions().catch((err) => console.error(err));
