import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IFilesRepository } from '../repositories/IFilesRepository'
import { FileCitationFormat } from '../models/FileCitationFormat'

export class GetFileCitationByFormat implements UseCase<string> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Returns the File citation in the requested format (EndNote XML, RIS, BibTeX, CSL JSON, or Internal HTML).
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {FileCitationFormat} [format] - The citation format to return.
   * @returns {Promise<string>}
   */
  async execute(fileId: number | string, format: FileCitationFormat): Promise<string> {
    return await this.filesRepository.getFileCitationByFormat(fileId, format)
  }
}
