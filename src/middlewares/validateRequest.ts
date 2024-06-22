import { Request, Response, NextFunction } from 'express';


interface ValidationError{
    [field:string]:string;
}

export const validateRequest = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const errors: ValidationError = {};

        fields.forEach(field => {
            if (!req.body[field]) {
                errors[field] = `${field} is required`;
            } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body[field])) {
                errors[field] = 'Invalid email format';
            } else if (field === 'password' && req.body[field].length < 6) {
                errors[field] = 'Password must be at least 6 characters long';
            }
        });

        if (Object.keys(errors).length > 0) {
            res.status(400).json({ errors });
        } else {
            next();
        }
    };
};