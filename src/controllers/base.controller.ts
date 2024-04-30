import createDebug from 'debug';
import { type Repo } from '../repositories/type.repo';
import type Joi from 'joi';
import { type NextFunction, type Request, type Response } from 'express';
const debug = createDebug('TFD:base:controller');

export abstract class BaseController<T, C> {
  constructor(
    protected readonly repo: Repo<T, C>,
    protected readonly validateCreateDtoSchema: Joi.ObjectSchema<C>,
    protected readonly validateUpdateDtoSchema: Joi.ObjectSchema<C>
  ) {
    debug('Instantiated base controller');
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.readAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
