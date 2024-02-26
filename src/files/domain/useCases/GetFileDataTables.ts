import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { FileDataTable } from '../models/FileDataTable';

export class GetFileDataTables implements UseCase<FileDataTable[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  /**
   * This use case is oriented toward tabular files and provides an array of FileDataTable objects for an existing tabular file.
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<FileDataTable[]>}
   */
  async execute(fileId: number | string): Promise<FileDataTable[]> {
    return await this.filesRepository.getFileDataTables(fileId);
  }
}
