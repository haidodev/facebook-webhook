import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

interface PipeOptions {
  maxSize: number;
  fileType: string[];
}
@Injectable()
export class FilesSizeValidationPipe implements PipeTransform {
  constructor(private readonly options: PipeOptions) {}
  transform(value: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    
    return value.filter(
      (file) =>
        file.size <= this.options.maxSize &&
        this.options.fileType.includes(file.mimetype),
    );
  }
}
