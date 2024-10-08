import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { CreateInternDto } from "../dtos/createIntern.dto";
dotenv.config();
const { JWT_SECRET = "" } = process.env;
export class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }
  static generateToken(payload: CreateInternDto) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}
