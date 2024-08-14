import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import bcrypt from 'bcrypt'
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    console.log('Received token:', token);

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required and must be a string' });
    }

    try {
        const internRepository = AppDataSource.getRepository(Intern);
        const interns = await internRepository.find(); // Fetch all interns

        let matchedIntern: Intern | null = null;
        for (const intern of interns) {
            if (intern.verificationToken && await bcrypt.compareSync(token, intern.verificationToken)) {
                matchedIntern = intern;
                break;
            }
        }

        console.log('Matched intern is', matchedIntern);

        if (!matchedIntern || matchedIntern.tokenExpiry === null || matchedIntern.tokenExpiry < new Date()) {
            return res.status(400).json({ error: 'check check Invalid or expired token' });
        }

        matchedIntern.isVerified = true;
        matchedIntern.verificationToken = null;
        matchedIntern.tokenExpiry = null;
        await internRepository.save(matchedIntern);

        return res.status(200).json({ message: 'Email successfully verified' });

    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ error: 'An error occurred during verification' });
    }
};
