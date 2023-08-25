import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { FileUserPermissions } from '../models/FileUserPermissions';

export class GetFileUserPermissions implements UseCase<FileUserPermissions> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(fileId: number | string): Promise<FileUserPermissions> {
    return await this.filesRepository.getFileUserPermissions(fileId);
  }
}
