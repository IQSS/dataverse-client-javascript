import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IFilesRepository } from '../repositories/IFilesRepository'
import { UpdateFileMetadataDTO } from '../dtos/UpdateFileMetadataDTO'

export class UpdateFileMetadata implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Updates the metadata for a particular File.
   * More detailed information about the file restriction behavior can be found in https://guides.dataverse.org/en/latest/api/native-api.html#updating-file-metadata
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {UpdateFileMetadataDTO} [updateFileMetadataDTO] - The DTO containing the metadata updates.
   * @returns {Promise<void>}
   */
  async execute(
    fileId: number | string,
    updateFileMetadataDTO: UpdateFileMetadataDTO
  ): Promise<void> {
    await this.filesRepository.updateFileMetadata(fileId, updateFileMetadataDTO)
  }
}
