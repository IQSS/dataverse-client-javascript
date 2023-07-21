import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { FileThumbnailClass } from '../models/FileThumbnailClass';

export class GetFileThumbnailClass implements UseCase<FileThumbnailClass> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(fileId: number | string): Promise<FileThumbnailClass> {
    return await this.filesRepository.getFileThumbnailClass(fileId);
  }
}
