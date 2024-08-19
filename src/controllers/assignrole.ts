import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { Role } from "../entity/role";
import { UserRole } from "../entity/userrole";
import { QueryFailedError, Repository } from "typeorm";
import { mRole, mUserRole } from "../models/mongoschema";

interface customRequest extends Request {
  internRepository?: Repository<Intern>;
}

export const addRole = async (req: customRequest, res: Response) => {
  const { name, description } = req.body;
  const { userId } = req.params;
  try {
    const internRepository = AppDataSource.getRepository(Intern);
    const intern = await internRepository.findOne({
      where: { id: parseInt(userId, 10) },
    });
    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }
    const role = await mRole.findOne({ name: name });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    const existingUserRole = await mUserRole.findOne({
      internId: intern.id,
      roleId: role._id,
    });

    if (existingUserRole) {
      console.log("User role is", existingUserRole);
      return res
        .status(400)
        .json({ message: "Role already assigned to the user" });
    }

    const userRole = new mUserRole({
      internId: intern.id,
      roleId: role._id,
      assignedAt: new Date(),
    });

    await userRole.save();
    return res
      .status(200)
      .json({ message: "Role assigned successfully", intern, userRole });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "An unexpected error occured" });
    }
  }
};

export const assignRoleToIntern = async (req: customRequest, res: Response) => {
  const { roleName } = req.body;
  const { userId } = req.params;
  console.log("user id to assign role is", userId);
  console.log("Req.body from assignrole is", req.body);

  try {
    const internRepository = AppDataSource.getRepository(Intern);
    const roleRepository = AppDataSource.getRepository(Role);
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    // Find the intern by userId
    const intern = await internRepository.findOne({
      where: { id: parseInt(userId, 10) },
      relations: ["userRoles"],
    });

    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }

    // Find the role by its name
    const role = await roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Check if the role is already assigned to the user
    const existingUserRole = await userRoleRepository.findOne({
      where: { intern, roles: role },
    });

    if (existingUserRole) {
      console.log("user role is", existingUserRole);
      return res
        .status(400)
        .json({ message: "Role already assigned to the user" });
    }

    // Create and save the new user role association
    const userRole = new UserRole();
    userRole.intern = intern;
    userRole.roles = role;
    await userRoleRepository.save(userRole);

    return res
      .status(200)
      .json({ message: "Role assigned successfully", intern, userRole });
  } catch (err: unknown) {
    if (err instanceof QueryFailedError) {
      const sqlError = err.driverError;
      return res.status(500).json({ error: sqlError.message });
    } else if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
