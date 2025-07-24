import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class UpdateFileTabularTags implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Updates the tabular tabular Tags for a particular File.
   * More detailed information about updating a file's tabularTags behavior can be found in https://guides.dataverse.org/en/latest/api/native-api.html#updating-file-tabular-tags
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string[]} [tabularTags] - The tabular tags to be added to the file.
   * @param {boolean} [replace](optional) - If true, replaces the existing tabularTags with the new ones. If false, adds the new tabularTags to the existing ones.
   * @returns {Promise<void>}
   */
  async execute(fileId: number | string, tabularTags: string[], replace?: boolean): Promise<void> {
    await this.filesRepository.updateFileTabularTags(fileId, tabularTags, replace)
  }
}
