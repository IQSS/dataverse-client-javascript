import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { FileDataTable } from '../models/FileDataTable';

export class GetFileDataTables implements UseCase<FileDataTable[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(fileId: number | string): Promise<FileDataTable[]> {
    return await this.filesRepository.getFileDataTables(fileId);
  }
}
