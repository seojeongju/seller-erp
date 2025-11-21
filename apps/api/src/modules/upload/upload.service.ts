import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  // 향후 클라우드 스토리지 연동 시 사용
  async uploadToCloudStorage(file: Express.Multer.File, tenantId: string): Promise<string> {
    // Cloudflare R2 또는 AWS S3 연동 로직
    // 현재는 로컬 파일 시스템 사용
    return `/uploads/${file.filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // 파일 삭제 로직
    // 클라우드 스토리지 사용 시 삭제 API 호출
  }
}

