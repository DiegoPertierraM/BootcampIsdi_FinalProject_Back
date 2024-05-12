import Joi from 'joi';
import { type UserCreateDto } from './user';

export const userCreateDtoSchema = Joi.object<UserCreateDto>({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string(),
  location: Joi.string().required(),
  birthDateString: Joi.string().required(),
  gender: Joi.string().required(),
  bio: Joi.string().default(''),
});

export const userUpdateDtoSchema = Joi.object<UserCreateDto>({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.string(),
  location: Joi.string(),
  birthDateString: Joi.string(),
  gender: Joi.string(),
  bio: Joi.string(),
});
