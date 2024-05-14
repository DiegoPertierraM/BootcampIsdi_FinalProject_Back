import Joi from 'joi';
import { type MeetCreateDto } from './meet';

export const meetCreateDtoSchema = Joi.object<MeetCreateDto>({
  title: Joi.string().required(),
  creatorId: Joi.string().required(),
  description: Joi.string().default(''),
  sport: Joi.string().required(),
  location: Joi.string(),
  date: Joi.string().required(),
  image: Joi.string(),
});

export const meetUpdateDtoSchema = Joi.object<MeetCreateDto>({
  title: Joi.string(),
  creatorId: Joi.string(),
  description: Joi.string(),
  sport: Joi.string(),
  location: Joi.string(),
  date: Joi.string(),
  image: Joi.string(),
});
