import Joi from 'joi';
import { type UserCreateDto } from './user';

export const userCreateDtoSchema = Joi.object<UserCreateDto>({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string(),
  location: Joi.string().required(),
  birthDate: Joi.date().required(),
  gender: Joi.string().required(),
  bio: Joi.string().default(''),
});

export const userUpdateDtoSchema = Joi.object<UserCreateDto>({
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().optional(),
  avatar: Joi.string().optional(),
  location: Joi.string().optional(),
  birthDate: Joi.date().optional(),
  bio: Joi.string().optional(),
}).min(1);
