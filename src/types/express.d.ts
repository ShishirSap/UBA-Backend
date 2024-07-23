import { Repository } from "typeorm";
import { Intern } from "../entity/intern";
declare global{
    namespace Express{
        interface Request{
            internRepository?:Repository<Intern>
        }
    }
}