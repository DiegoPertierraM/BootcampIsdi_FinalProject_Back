import Joi from 'joi';
import { type EventCreateDto } from './event';

export const eventCreateDtoSchema = Joi.object<EventCreateDto>({
  title: Joi.string().required(),
  creatorId: Joi.string().required(),
  description: Joi.string().default(''),
  sport: Joi.string().required(),
  location: Joi.string(),
  date: Joi.string().required(),
  image: Joi.string(),
});

export const eventUpdateDtoSchema = Joi.object<EventCreateDto>({
  title: Joi.string(),
  creatorId: Joi.string(),
  description: Joi.string(),
  sport: Joi.string(),
  location: Joi.string(),
  date: Joi.string(),
  image: Joi.string(),
});
