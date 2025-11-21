import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
@UseGuards(TenantGuard, AuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.NODE_ENV === 'production' 
          ? './uploads'
          : './src/uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('지원하지 않는 이미지 형식입니다.'), false);
        }
      },
    }),
  )
  async uploadImage(
    @TenantId() tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }

    // 실제 운영 환경에서는 클라우드 스토리지에 업로드
    // 현재는 로컬 파일 시스템에 저장하고 URL 반환
    const fileUrl = `/uploads/${file.filename}`;
    
    return {
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}

