import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Role } from '../entity/role';

class RoleController {
    // Create a new role
    async createRole(req: Request, res: Response) {
        const roleRepository = AppDataSource.getRepository(Role)
        const { name, description } = req.body;

        try {
            // Check if the role already exists
            const existingRole = await roleRepository.findOne({ where: { name } });
            if (existingRole) {
                return res.status(400).json({ message: 'Role already exists' });
            }

            const role = new Role();
            role.name = name;
            role.description = description;

            await roleRepository.save(role);
            return res.status(201).json({ message: 'Role created successfully', role });
        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Get all roles
    async getAllRoles(req: Request, res: Response) {
        const roleRepository = AppDataSource.getRepository(Role);

        try {
            const roles = await roleRepository.find();
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Get a role by ID
    async getRoleById(req: Request, res: Response) {
        const roleRepository = AppDataSource.getRepository(Role);
        const { id } = req.params;

        try {
            const role = await roleRepository.findOne({ where: { id: BigInt(id) } });
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            return res.status(200).json(role);
        } catch (error) {
            console.error('Error fetching role:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Delete a role by ID
    async deleteRole(req: Request, res: Response) {
        const roleRepository = AppDataSource.getRepository(Role);
        const { id } = req.params;

        try {
            const role = await roleRepository.findOne({ where: { id: BigInt(id) } });
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            await roleRepository.remove(role);
            return res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            console.error('Error deleting role:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new RoleController();
