import { IFilesRepository } from '../repositories/IFilesRepository'
import { UseCase } from '../../../core/domain/useCases/UseCase'

export class DeleteFile implements UseCase<void> {
  constructor(private readonly filesRepository: IFilesRepository) {}

  /**
   * Deletes a file.
   * More detailed information about the file deletion behavior can be found in https://guides.dataverse.org/en/latest/api/native-api.html#deleting-files
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<void>} -This method does not return anything upon successful completion.
   */
  async execute(fileId: number | string): Promise<void> {
    return await this.filesRepository.deleteFile(fileId)
  }
}
