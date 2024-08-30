import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { QueryFailedError, Repository } from "typeorm";
import { encrypt } from "../helpers/helpers";
import { Role } from "../entity/role";
import { UserRole } from "../entity/userrole";
import { CreateInternDto } from "../dtos/createIntern.dto";
import { sendInviteEmail } from "../helpers/emailService";
import { generateVerificationToken } from "../helpers/verificationtoken";
import bcrypt from "bcrypt";
import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import { IRole, mRole, mUserRole } from "../models/mongoschema";
dotenv.config();

interface customRequest extends Request {
  internRepository?: Repository<Intern>;
  user?: CreateInternDto;
}
const client = new Client({
  node: "https://127.0.0.1:9200",
  auth: {
    username: "elastic",
    password: "N+za+u9y_h-nGWkvC2fp",
  },
  tls: {
    rejectUnauthorized: false, // if using self-signed certificate
  },
});

export const bulkindexing = async () => {
  const internRepository = AppDataSource.getRepository(Intern);
  const interns = internRepository.find();
  const bulk = (await interns).flatMap((doc) => [
    { index: { _index: "interns", _id: doc.id } },
    doc,
  ]);
  const body = await client.bulk({ refresh: true, body: bulk });
};

// export const searchelastic = async (req: customRequest, res: Response) => {
//   const { query } = req.query;
//   if (!query) {
//     return res.json({ error: "query is undefined" });
//   }
//   const searchQuery: string = query?.toString();
//   console.log("search query is", searchQuery);
//   console.log("query is", query);
//   try {
//     const body = await client.search({
//       index: "interns",
//       query: {
//         multi_match: {
//           query: searchQuery,
//           fields: [
//             "firstName",
//             "lastName",
//             "email",
//             "university",
//             "degree",
//             "major",
//           ],
//         },
//       },
//     });

//     res.json(body.hits.hits);
//   } catch (error) {
//     console.error("Search error:", error);
//     res.status(500).json({ error: "Search failed" });
//   }
// };

export const createIntern = async (req: customRequest, res: Response) => {
  console.log("req.body is", req.body);

  const internRepository = req.internRepository as Repository<Intern>;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    university,
    degree,
    major,
    password,
    dateOfBirth,
    gender,
  } = req.body;
  const encryptedPassword = await encrypt.encryptpass(password);

  try {
    const intern = new Intern();
    intern.firstName = firstName;
    intern.lastName = lastName;
    intern.email = email;
    intern.password = encryptedPassword;
    intern.phoneNumber = phoneNumber;
    intern.address = address;
    intern.university = university;
    intern.degree = degree;
    intern.major = major;
    intern.dateOfBirth = dateOfBirth;
    intern.gender = gender;

    const emailToken = generateVerificationToken();
    intern.verificationToken = await bcrypt.hashSync(emailToken, 12);
    intern.tokenExpiry = new Date(Date.now() + 2 * 60 * 1000);

    console.log("Token expiry is", intern.tokenExpiry);

    await internRepository.save(intern);
    await bulkindexing();

    const token = encrypt.generateToken({
      id: intern.id,
      firstName: firstName,
      lastName: lastName,
      email: intern.email,
    });

    await sendInviteEmail({
      recipientEmail: intern.email,
      inviteToken: emailToken,
    });

    return res.status(201).json({
      message: "user created successfully",
      intern,
      emailToken,
    });
  } catch (err: unknown) {
    if (err instanceof QueryFailedError) {
      const sqlError = err.driverError;
      if (sqlError.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res
        .status(500)
        .json({ error: "An error occured while creating intern" });
    } else if (err instanceof Error) {
      console.error("Error:", err.message);
      return res.status(500).json({ error: "An unexpected error occured" });
    } else {
      console.error("Unknown error:", err);
      return res.status(500).json({ error: "An unexpected error occured" });
    }
  }
};

export const getAllInterns = async (req: customRequest, res: Response) => {
  console.log("Getall intern is hit");
  try {
    const internRepository = req.internRepository as Repository<Intern>;
    const interns = await internRepository.find({});
    bulkindexing();
    console.log("total number of interns are", interns.length);
    return res.status(200).json(interns);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching interns" });
  }
};

export const updateIntern = async (req: customRequest, res: Response) => {
  const { id } = req.params;
  console.log("Requester user id is", req.user?.id);
  console.log("req for update is", req.body);
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    university,
    degree,
    major,
    dateOfBirth,
    gender,
    password,
  } = req.body;

  try {
    const internRepository = req.internRepository as Repository<Intern>;

    const intern = await internRepository.findOneBy({ id: parseInt(id, 10) });
    console.log("intern found to be updated is", intern);
    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }

    const userRole = await mUserRole.findOne({ internId: req.user?.id });

    if (!userRole) {
      return res
        .status(403)
        .json({ message: "You donot have permission to edit this profile" });
    }
    const adminRole: IRole | null = await mRole.findOne({ name: "admin" });
    if (!adminRole) {
      return res.status(500).json({ message: "Admin role not found" });
    }
    if (
      userRole.roleId.toString() !== adminRole.id.toString() &&
      req.user?.id !== intern.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    intern.firstName = firstName || intern.firstName;
    intern.lastName = lastName || intern.lastName;
    intern.email = email || intern.email;
    intern.phoneNumber = phoneNumber || intern.phoneNumber;
    intern.address = address || intern.address;
    intern.university = university || intern.university;
    intern.degree = degree || intern.degree;
    intern.major = major || intern.major;
    intern.dateOfBirth = dateOfBirth || intern.dateOfBirth;
    intern.gender = gender || intern.gender;
    if (password) {
      intern.password = await encrypt.encryptpass(password);
    }

    await internRepository.save(intern);
    await bulkindexing();

    return res.status(200).json({ message: "Update successful", intern });
  } catch (err: unknown) {
    if (err instanceof QueryFailedError) {
      const sqlError = err.driverError;
      if (sqlError.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res
        .status(500)
        .json({ error: "An error occured while creating intern" });
    } else if (err instanceof Error) {
      console.error("Error:", err.message);
      return res.status(500).json({ error: "An unexpected error occured" });
    } else {
      console.error("Unknown error:", err);
      return res.status(500).json({ error: "An unexpected error occured" });
    }
  }
};

export const getInternById = async (req: customRequest, res: Response) => {
  console.log("Req.params is ", req.params);
  const { id } = req.params;

  try {
    const internRepository = req.internRepository as Repository<Intern>;
    const intern = await internRepository.findOneBy({ id: parseInt(id, 10) });
    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }
    return res.status(200).json(intern);
  } catch (error) {
    console.error("Error fetching intern by id", error);
    return res.status(500).json({ error: "Error fetching intern" });
  }
};

export const deleteIntern = async (req: customRequest, res: Response) => {
  console.log("delete is hit");
  const { id } = req.params;

  try {
    const internRepository = req.internRepository as Repository<Intern>;

    // Step 1: Check if the intern exists in MySQL
    const intern = await internRepository.findOneBy({ id: parseInt(id, 10) });
    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }

    // Step 2: Delete the document from Elasticsearch
    const esResponse = await client.delete({
      index: "interns",
      id: id.toString(),
    });
    console.log("esresponse is", esResponse);

    if (esResponse.result !== "deleted") {
      // If the deletion from Elasticsearch failed, return an error
      return res
        .status(500)
        .json({ error: "Error deleting intern from Elasticsearch" });
    }

    // Step 3: Remove the intern from MySQL
    await internRepository.remove(intern);

    return res.status(200).json({ message: "Intern deleted successfully" });
  } catch (error) {
    console.error("Error during deletion:", error);
    return res.status(500).json({ error: "Error deleting intern" });
  }
};

export const searchInternsVulnerable = async (
  req: customRequest,
  res: Response,
) => {
  const { email } = req.query;
  if (typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const internRepository = req.internRepository as Repository<Intern>;
    const intern = await internRepository.query(`
            SELECT * FROM intern WHERE EMAIL='${email}'`);

    // const intern = await internRepository.query(
    //   `SELECT * FROM intern WHERE EMAIL = ?`,
    //   [email] // Parameterized input
    // );

    if (intern.length === 0) {
      return res.status(404).json({ error: "Intern not found" });
    }
    return res.status(200).json(intern);
  } catch (error) {
    return res.status(500).json({ error: "Error searching interns" });
  }
};
