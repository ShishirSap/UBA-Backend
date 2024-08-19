import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { encrypt } from "../helpers/helpers";
import {
  mUserRole,
  mRole,
  mRolePermission,
  mPermission,
} from "../models/mongoschema"; // MongoDB models

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Fetch the intern from MySQL
      const internRepository = AppDataSource.getRepository(Intern);
      const intern = await internRepository.findOne({ where: { email } });

      if (!intern) {
        return res
          .status(404)
          .json({ message: "No intern with provided email found" });
      }

      // Validate the password
      const isPasswordValid = encrypt.comparepassword(
        password,
        intern.password,
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password is incorrect" });
      }

      // Fetch user roles from MongoDB
      const userRoles = await mUserRole
        .find({ internId: intern.id })
        .populate("roleId");

      // Extract roles and permissions
      const roles = userRoles.map((userRole) => {
        const role = userRole.roleId as any;
        return role.name;
      });

      // Fetch permissions based on roles
      let permissions: string[] = [];

      for (const userRole of userRoles) {
        const roleId = userRole.roleId._id;

        // Fetch RolePermissions for each roleId
        const rolePermissions = await mRolePermission
          .find({ roleId })
          .populate("permissionId");

        // Extract the permission names and add to the permissions array
        rolePermissions.forEach((rolePermission) => {
          const permission = rolePermission.permissionId as any;
          permissions.push(permission.name);
        });
      }

      // Generate JWT token
      const token = encrypt.generateToken({
        id: intern.id,
        firstName: intern.firstName,
        lastName: intern.lastName,
        email: intern.email,
      });

      return res.status(200).json({
        message: "Login successful",
        intern: {
          id: intern.id,
          firstName: intern.firstName,
          lastName: intern.lastName,
          email: intern.email,
          roles,
          permissions,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
