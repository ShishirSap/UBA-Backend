import { Request,Response,NextFunction, Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/users";
// import { validateRequest } from "../middlewares/validateRequest";
import schemaValidator from "../middlewares/schemaValidator";
const router=Router()


router.get("/",getAllUsers)

router.get("/:id",getUser)

router.put('/:id', schemaValidator('/auth/update'),updateUser)

router.post("/signup",schemaValidator('/auth/signup'), createUser)

router.delete('/:id',deleteUser);

router.get('/timeout/simulate', (req: Request, res: Response, next: NextFunction) => {
    setTimeout(() => {
      res.status(504).send('Gateway Timeout');
    }, 5000); // Simulates a delay of 10 seconds
  });

router.all('/', (req: Request, res: Response) => {
    res.status(405).send('Method Not Allowed');
  });



export default router