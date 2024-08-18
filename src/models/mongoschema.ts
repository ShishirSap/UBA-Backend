import mongoose, { Document, Schema } from "mongoose";

interface IRole extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
