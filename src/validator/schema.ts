import Joi, { ObjectSchema } from "joi";

const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
  );
  
  const authSignup=Joi.object().keys({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(PASSWORD_REGEX).min(8).required(),

  })

  const authSignin=Joi.object().keys({
    email:Joi.string().required(),
    password:Joi.string().required()
  })

  const authUpdate = Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).optional(),
  });

  export default{
    '/auth/signin':authSignin,
    '/auth/signup':authSignup,
    '/auth/update':authUpdate
  } as {[key:string]:ObjectSchema}