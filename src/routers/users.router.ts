import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type UsersController } from '../controllers/users.controller.js';

const debug = createDebug('TFD:users:router');

export class UsersRouter {
  router = createRouter();

  constructor(readonly controller: UsersController) {
    debug('Instantiated users router');

    this.router.get('/', controller.getAll.bind(controller));
  }
}
