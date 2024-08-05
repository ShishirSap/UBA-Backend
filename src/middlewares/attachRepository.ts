import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Intern } from '../entity/intern';
import { Repository } from 'typeorm';
interface customRequest extends Request{
    internRepository?:Repository<Intern>
}

export const attachRepositoryMiddleware = (req: customRequest, res: Response, next: NextFunction) => {
    req.internRepository = AppDataSource.getRepository(Intern);
    console.log(req.internRepository)
    next();
};
