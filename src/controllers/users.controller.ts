import createDebug from 'debug';
import { BaseController } from './base.controller.js';
import { type User, type UserCreateDto } from '../entities/user';
import {
  userCreateDtoSchema,
  userUpdateDtoSchema,
} from '../entities/user.schema.js';
import { type Repo } from '../repositories/type.repo.js';
const debug = createDebug('TFD:users:controller');

export class UsersController extends BaseController<User, UserCreateDto> {
  constructor(protected readonly repo: Repo<User, UserCreateDto>) {
    super(repo, userCreateDtoSchema, userUpdateDtoSchema);
    debug('Instantiated users controller');
  }
}
