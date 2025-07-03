import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class GetFileDownloadCount implements UseCase<number> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Provides the download count for a particular File.
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<number>}
   */
  async execute(fileId: number | string): Promise<number> {
    return await this.filesRepository.getFileDownloadCount(fileId)
  }
}
