import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { FileUserPermissions } from '../models/FileUserPermissions';

export class GetFileUserPermissions implements UseCase<FileUserPermissions> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  /**
   * Returns a FileUserPermissions object, which includes the permissions that the calling user has on a particular File.
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<FileUserPermissions>}
   */
  async execute(fileId: number | string): Promise<FileUserPermissions> {
    return await this.filesRepository.getFileUserPermissions(fileId);
  }
}
