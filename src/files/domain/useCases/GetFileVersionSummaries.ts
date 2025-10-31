import { UseCase } from '../../../core/domain/useCases/UseCase'
import { FileVersionSummarySubset } from '../models/FileVersionSummaryInfo'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class GetFileVersionSummaries implements UseCase<FileVersionSummarySubset> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Returns a list of versions for a given file including a summary of differences between consecutive versions
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @returns {Promise<FileVersionSummarySubset>} - A FileVersionSummarySubset containing the summaries and total count.
   */
  async execute(
    fileId: number | string,
    limit?: number,
    offset?: number
  ): Promise<FileVersionSummarySubset> {
    return await this.filesRepository.getFileVersionSummaries(fileId, limit, offset)
  }
}
