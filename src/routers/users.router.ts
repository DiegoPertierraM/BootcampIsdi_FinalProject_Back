import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type UsersController } from '../controllers/users.controller.js';
import { type AuthInterceptor } from '../middleware/auth.interceptor';
import { type FilesInterceptor } from '../middleware/files.interceptor.js';

const debug = createDebug('TFD:users:router');

export class UsersRouter {
  router = createRouter();

  constructor(
    readonly controller: UsersController,
    readonly authInterceptor: AuthInterceptor,
    readonly filesInterceptor: FilesInterceptor
  ) {
    debug('Instantiated users router');

    this.router.post(
      '/register',
      filesInterceptor.singleFile('avatar'),
      filesInterceptor.cloudinaryUpload.bind(filesInterceptor),
      controller.create.bind(controller)
    );
    this.router.post('/login', controller.login.bind(controller));

    this.router.get('/', controller.getAll.bind(controller));
    this.router.get('/:id', controller.getById.bind(controller));

    this.router.patch(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      filesInterceptor.singleFile('avatar'),
      filesInterceptor.cloudinaryUpload.bind(filesInterceptor),
      controller.update.bind(controller)
    );
    this.router.delete(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.delete.bind(controller)
    );

    this.router.post(
      '/:userId/saved-meets/:meetId',
      authInterceptor.authentication.bind(authInterceptor),
      controller.manageMeet.bind(controller)
    );

    this.router.delete(
      '/:userId/saved-meets/:meetId',
      authInterceptor.authentication.bind(authInterceptor),
      controller.manageMeet.bind(controller)
    );

    this.router.post(
      '/:userId/joined-meets/:meetId',
      authInterceptor.authentication.bind(authInterceptor),
      controller.manageMeet.bind(controller)
    );

    this.router.delete(
      '/:userId/joined-meets/:meetId',
      authInterceptor.authentication.bind(authInterceptor),
      controller.manageMeet.bind(controller)
    );

    this.router.post(
      '/:userId/add-friend/:friendId',
      authInterceptor.authentication.bind(authInterceptor),
      controller.addFriend.bind(controller)
    );

    this.router.delete(
      '/:userId/add-friend/:friendId',
      authInterceptor.authentication.bind(authInterceptor),
      controller.deleteFriend.bind(controller)
    );

    this.router.get(
      '/:userId/friends',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getFriends.bind(controller)
    );
  }
}
