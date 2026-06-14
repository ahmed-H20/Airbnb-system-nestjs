/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  // sizeLimit in bytes : 1MB
  constructor(private readonly sizeLimit: number = 1_000_000) {}

  transform(file: any, metadata: ArgumentMetadata) {
    console.log(file);

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['png', 'jpg', 'jpeg'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const fileType = file.mimetype.split('/')[1].toLowerCase();

    if (!allowedTypes.includes(fileType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.sizeLimit) {
      throw new BadRequestException(
        `File too large. Max size is ${this.sizeLimit / 1000} KB`,
      );
    }

    // File is valid
    return file;
  }
}
