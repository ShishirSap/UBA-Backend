import { Request, Response, NextFunction } from 'express';
import { users } from '../controllers/users';


interface ValidationError{
    [field:string]:string;
}

function isEmailUsed(email:string):boolean{
    return !users.some(user=>user.email===email)

}

export const validateRequest = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const errors: ValidationError = {};

        fields.forEach(field => {
            const value=req.body[field]
            if (!value) {
                errors[field] = `${field} is required`;
            } else if (field === 'email') {
                
               if( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body[field])) {
                errors[field] = 'Invalid email format';
            }
            else if(!isEmailUsed(value)){

                errors[field]='Email already in use'
            }
            }
            
            else if (field === 'password') {
                if (value.length < 6) {
                    errors[field] = 'Password must be at least 6 characters long';
                }
                if (!/[A-Z]/.test(value)) {
                    errors[field] = errors[field] ? `${errors[field]}, must contain at least one uppercase letter` : 'Password must contain at least one uppercase letter';
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    errors[field] = errors[field] ? `${errors[field]}, must contain at least one special character` : 'Password must contain at least one special character';
                }
            }
        });

        if (Object.keys(errors).length > 0) {
            res.status(400).json({ errors });
        } else {
            next();
        }
    };
};