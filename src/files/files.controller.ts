import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imgName')
  findProductImage(@Res() res: Response, @Param('imgName') imgName: string) {
    const path = this.filesService.getProductImage(imgName);

    res.status(200).sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      limits: {
        fileSize: 1000000,
      },
      storage: diskStorage({
        destination: './files',
        filename: fileNamer,
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.create(file, this.configService.get('HOST_API'));
  }
}
