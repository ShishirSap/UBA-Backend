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

   const createInternSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().optional(),
    address: Joi.string().optional(),
    university: Joi.string().optional(),
    degree: Joi.string().optional(),
    major: Joi.string().optional(),
    dateOfBirth: Joi.date().optional().custom((value,helpers)=>{
      const now=new Date()
      const dob=new Date(value)
      if(dob>now){
        return helpers.error('date.future')
      }
      return value
    }).messages({
      'date.future':'Date of birth cannot be in the future'
    }),
    gender: Joi.string().valid('M', 'F', 'Other').optional(),
    password:Joi.string().pattern(PASSWORD_REGEX).min(8).required()
});

const updateInternSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
  address: Joi.string().optional(),
  university: Joi.string().optional(),
  degree: Joi.string().optional(),
  major: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('M', 'F', 'Other').optional(),
  password:Joi.string().pattern(PASSWORD_REGEX).min(8).optional()
});

  export default{
    '/auth/signin':authSignin,
    '/auth/signup':authSignup,
    '/auth/update':authUpdate,
    '/auth/intern/signup':createInternSchema,
    '/auth/intern/update':updateInternSchema
  } as {[key:string]:ObjectSchema}