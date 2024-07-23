import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Intern } from '../entity/intern';

export const attachRepositoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req['internRepository'] = AppDataSource.getRepository(Intern);
    next();
};
