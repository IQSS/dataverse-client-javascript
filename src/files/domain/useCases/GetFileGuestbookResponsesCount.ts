import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';

export class GetFileGuestbookResponsesCount implements UseCase<number> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(fileId: number | string): Promise<number> {
    return await this.filesRepository.getFileGuestbookResponsesCount(fileId);
  }
}
