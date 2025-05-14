import { IFilesRepository } from '../repositories/IFilesRepository'
import { UseCase } from '../../../core/domain/useCases/UseCase'

export class IsFileDeleted implements UseCase<boolean> {
  constructor(private readonly filesRepository: IFilesRepository) {}

  /**
   * Returns a boolean, indicating whether the file has been deleted or not.
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<boolean>} - A boolean indicating whether the file has been deleted or not.
   */
  async execute(fileId: number | string): Promise<boolean> {
    return await this.filesRepository.isFileDeleted(fileId)
  }
}
