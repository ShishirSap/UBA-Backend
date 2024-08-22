import { Request, Response } from "express";
import { getRedisClient } from "../connections/redisConnection";
import { mPermission } from "../models/mongoschema";

export const getAllPermissions = async (req: Request, res: Response) => {
  const redisclient = await getRedisClient();
  const cachedPermissions = await redisclient.get("permissions");
  if (cachedPermissions) {
    return res.status(200).json(JSON.parse(cachedPermissions));
  }
  try {
    const permissionsFromDb = await mPermission.find();
    redisclient.setEx("permissions", 3600, JSON.stringify(permissionsFromDb));
    return res.status(200).json(permissionsFromDb);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch permissions" });
  }
};

export const createpermissions = async (req: Request, res: Response) => {
  try {
    const redisclient = await getRedisClient();
    const { name, description } = req.body;
    const newPermission = new mPermission({ name, description });
    await newPermission.save();
    redisclient.del("permissions");
    res.status(201).json(newPermission);
  } catch (error) {
    res.status(500).json({ error: "Failed to create permission" });
  }
};
