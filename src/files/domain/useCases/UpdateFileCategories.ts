import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class UpdateFileCategories implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Updates the  categories for a particular File.
   * More detailed information about updating a file's categories behavior can be found in https://guides.dataverse.org/en/latest/api/native-api.html#updating-file-metadata-categories
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string[]} [categories] - The categories to be added to the file.
   * @param {boolean} [replace](optional) - If true, replaces the existing categories with the new ones. If false, adds the new categories to the existing ones.
   * @returns {Promise<void>}
   */
  async execute(fileId: number | string, categories: string[], replace?: boolean): Promise<void> {
    await this.filesRepository.updateFileCategories(fileId, categories, replace)
  }
}
