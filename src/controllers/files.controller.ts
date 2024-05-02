/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';

const debug = createDebug('TFD:files:controller');

export class FilesController {
  constructor() {
    debug('Instantiated files controller');
  }

  fileHandler(req: Request, res: Response, next: NextFunction) {
    console.log('File', req.file);
    console.log('Body', req.body);
    if (!req.file) {
      next(new HttpError(400, 'Bad request', 'No file uploaded'));
      return;
    }

    res.json({
      message: 'File uploaded',
      field: req.file.fieldname,
      width: req.body.cloudinary.height,
      height: req.body.cloudinary.height,
      file: req.body.cloudinary.public_id,
      format: req.body.cloudinary.format,
      url: req.body.cloudinary.secure_url,
    });
  }
}
