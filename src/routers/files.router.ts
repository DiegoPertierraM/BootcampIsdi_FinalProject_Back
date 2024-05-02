import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type FilesController } from '../controllers/files.controller';
import { type FilesInterceptor } from '../middleware/files.interceptor';

const debug = createDebug('TFD:files:router');
export class FilesRouter {
  router = createRouter();

  constructor(
    readonly controller: FilesController,
    readonly interceptor: FilesInterceptor
  ) {
    debug('Instantiated files router');

    this.router.post(
      '/',
      interceptor.singleFile('avatar').bind(interceptor),
      interceptor.cloudinaryUpload.bind(interceptor),
      controller.fileHandler.bind(controller)
    );
  }
}
