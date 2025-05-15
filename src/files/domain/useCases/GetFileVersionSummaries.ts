import { UseCase } from '../../../core/domain/useCases/UseCase'
import { FileVersionSummaryInfo } from '../models/FileVersionSummaryInfo'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class GetFileVersionSummaries implements UseCase<FileVersionSummaryInfo[]> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Returns a list of versions for a given file including a summary of differences between consecutive versions
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<FileVersionSummaryInfo[]>} - An array of FileVersionSummaryInfo.
   */
  async execute(fileId: number | string): Promise<FileVersionSummaryInfo[]> {
    return await this.filesRepository.getFileVersionSummaries(fileId)
  }
}
