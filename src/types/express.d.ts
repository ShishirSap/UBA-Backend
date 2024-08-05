import { Repository } from "typeorm";
import { Intern } from "../entity/intern";
import { CreateInternDto } from "../dtos/createIntern.dto";
declare global{
    namespace Express{
        interface Request{
            internRepository?:Repository<Intern>
            user?:CreateInternDto
        }
    }
}
