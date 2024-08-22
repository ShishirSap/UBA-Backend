import { NextFunction, Request, Response } from "express";
import { mPermission, mRole } from "../models/mongoschema";

export const validateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description } = req.body;
  if (!name || typeof name !== "string") {
    return res
      .status(422)
      .json({ error: "Role name is required and must be a string" });
  }
  try {
    const existingRole = await mRole.findOne({ name });
    if (existingRole) {
      return res
        .status(400)
        .json({ error: "Role with this name already exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
export const validatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description } = req.body;

  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ error: "Permission name is required and must be a string" });
  }

  try {
    const existingPermission = await mPermission.findOne({ name });
    if (existingPermission) {
      return res
        .status(409)
        .json({ error: "Permission with this name already exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
