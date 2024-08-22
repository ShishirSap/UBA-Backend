import { Request, Response } from "express";
import { mRole } from "../models/mongoschema";
import { createClient } from "redis";
import { getRedisClient } from "../connections/redisConnection";
class RoleController {
  // Create a new role
  async createRole(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      // Check if the role already exists

      const newRole = new mRole({ name, description });
      await newRole.save();

      // redisclient.del('roles')
      return res
        .status(201)
        .json({ message: "Role created successfully", newRole });
    } catch (error) {
      console.error("Error creating role:", error);
      return res.status(500).json({ error: "Failed to create role" });
    }
  }

  // Get all roles
  async getAllRoles(req: Request, res: Response) {
    console.log("getroles is hit");
    const redisclient = await getRedisClient();

    console.log("redis is hit");
    const cachedRoles = await redisclient.get("roles");
    if (cachedRoles) {
      console.log("cached roles are", cachedRoles);
      console.log("i am form cache");
      return res.status(200).json(JSON.parse(cachedRoles));
    }

    try {
      const rolesFromDb = await mRole.find();
      redisclient.setEx("roles", 3600, JSON.stringify(rolesFromDb));
      return res.json(rolesFromDb);
    } catch (error) {
      console.error("Error fetching roles:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get a role by ID
  //     async getRoleById(req: Request, res: Response) {
  //         const roleRepository = AppDataSource.getRepository(Role);
  //         const { id } = req.params;

  //         try {
  //             const role = await roleRepository.findOne({ where: { id: BigInt(id) } });
  //             if (!role) {
  //                 return res.status(404).json({ message: 'Role not found' });
  //             }

  //             return res.status(200).json(role);
  //         } catch (error) {
  //             console.error('Error fetching role:', error);
  //             return res.status(500).json({ message: 'Internal server error' });
  //         }
  //     }

  //     // Delete a role by ID
  //     async deleteRole(req: Request, res: Response) {
  //         const roleRepository = AppDataSource.getRepository(Role);
  //         const { id } = req.params;

  //         try {
  //             const role = await roleRepository.findOne({ where: { id: BigInt(id) } });
  //             if (!role) {
  //                 return res.status(404).json({ message: 'Role not found' });
  //             }

  //             await roleRepository.remove(role);
  //             return res.status(200).json({ message: 'Role deleted successfully' });
  //         } catch (error) {
  //             console.error('Error deleting role:', error);
  //             return res.status(500).json({ message: 'Internal server error' });
  //         }
  //     }
}

export default new RoleController();
