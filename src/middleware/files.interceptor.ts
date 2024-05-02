import { type NextFunction, type Request, type Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import multer from 'multer';
import { HttpError } from './errors.middleware.js';
const debug = createDebug('TFD:files:interceptor');

export class FilesInterceptor {
  constructor() {
    debug('Instantiated files interceptor');
  }

  singleFile(fieldName = 'avatar') {
    debug('Creating single file middleware');
    const storage = multer.diskStorage({
      destination: 'uploads/',
      filename(_req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fieldName);

    return (req: Request, res: Response, next: NextFunction) => {
      debug('Uploading single file');
      const previousBody = req.body as Record<string, unknown>;
      middleware(req, res, next);
      req.body = { ...previousBody, ...req.body } as unknown;
    };
  }

  async cloudinaryUpload(req: Request, res: Response, next: NextFunction) {
    debug('Uploading file to cloudinary');
    const options = {
      folder: 'bc2024_1',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      use_filename: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_filename: false,
      overwrite: true,
    };

    if (!req.file) {
      next(new HttpError(400, 'Bad request', 'No file uploaded'));
      return;
    }

    const finalPath = req.file.destination + '/' + req.file.filename;

    try {
      const result = await cloudinary.uploader.upload(finalPath, options);
      req.body.cloudinary = result;
      next();
    } catch (error) {
      next(
        new HttpError(500, 'Internal server error', (error as Error).message)
      );
    }
  }
}
