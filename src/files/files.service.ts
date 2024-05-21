import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  create(file: Express.Multer.File, configService: ConfigService) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    const secureURL = `${configService}/files/product/${file.filename}`;

    return secureURL;
  }

  getProductImage(imageName: string) {
    const path = join(__dirname, '../../files', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`No product found with image ${imageName}`);

    return path;
  }
}
