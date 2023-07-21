import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';

export class CanFileBeDownloaded implements UseCase<boolean> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(fileId: number | string): Promise<boolean> {
    return await this.filesRepository.canFileBeDownloaded(fileId);
  }
}
