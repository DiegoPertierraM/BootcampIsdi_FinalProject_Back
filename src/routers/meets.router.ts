import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type AuthInterceptor } from '../middleware/auth.interceptor.js';
import { type FilesInterceptor } from '../middleware/files.interceptor.js';
import { type MeetsController } from '../controllers/meets.controller.js';
import { type MeetsRepo } from '../repositories/meets.repo.js';

const debug = createDebug('TFD:meets:router');

export class MeetsRouter {
  router = createRouter();

  constructor(
    readonly controller: MeetsController,
    readonly authInterceptor: AuthInterceptor,
    readonly filesInterceptor: FilesInterceptor,
    readonly meetsRepo: MeetsRepo
  ) {
    debug('Instantiated meets router');

    this.router.get('/', controller.getAll.bind(controller));
    this.router.get(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getById.bind(controller)
    );
    this.router.post(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      filesInterceptor.singleFile('image'),
      filesInterceptor.cloudinaryUpload.bind(filesInterceptor),
      controller.create.bind(controller)
    );

    this.router.patch(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor.authorization(meetsRepo, 'creator').bind(authInterceptor),
      controller.update.bind(controller)
    );
    this.router.delete(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor.authorization(meetsRepo, 'creator').bind(authInterceptor),
      controller.delete.bind(controller)
    );
  }
}
