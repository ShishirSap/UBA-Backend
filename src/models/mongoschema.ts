import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const mRole = mongoose.model<IRole>("Role", RoleSchema);

//Permission Schema
interface IPermission extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const mPermission = mongoose.model<IPermission>("Permission", PermissionSchema);

// RolePermission Schema
interface IRolePermission extends Document {
  roleId: mongoose.Types.ObjectId;
  permissionId: mongoose.Types.ObjectId;
  grantedAt: Date;
}

const RolePermissionSchema: Schema = new Schema({
  roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  permissionId: {
    type: Schema.Types.ObjectId,
    ref: "Permission",
    required: true,
  },
  grantedAt: { type: Date, default: Date.now },
});

const mRolePermission = mongoose.model<IRolePermission>(
  "RolePermission",
  RolePermissionSchema,
);

// UserRole Schema
interface IUserRole extends Document {
  internId: number; // Assuming this is still the ID from MySQL
  roleId: mongoose.Types.ObjectId;
  assignedAt: Date;
}

const UserRoleSchema: Schema = new Schema({
  internId: { type: Number, required: true }, // Reference to MySQL intern ID
  roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  assignedAt: { type: Date, default: Date.now },
});

const mUserRole = mongoose.model<IUserRole>("UserRole", UserRoleSchema);

export { mRole, mPermission, mRolePermission, mUserRole };
