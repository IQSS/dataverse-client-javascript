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
   * More detailed information about updating a file's metadata behavior can be found in https://guides.dataverse.org/en/latest/api/native-api.html#updating-file-metadata
   *
   * @param {number | string} [fileId] - The file identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {UpdateFileMetadataDTO} [updateFileMetadataDTO] - The DTO containing the metadata updates.
   * @param {string} [sourceLastUpdateTime] - The lastUpdateTime value from the file. If another user updates the file metadata before you send the update request, data inconsistencies may occur. To prevent this, you can use the optional sourceLastUpdateTime parameter. This parameter must include the lastUpdateTime value corresponding to the file being updated.
   * @returns {Promise<void>}
   */
  async execute(
    fileId: number | string,
    updateFileMetadataDTO: UpdateFileMetadataDTO,
    sourceLastUpdateTime?: string
  ): Promise<void> {
    await this.filesRepository.updateFileMetadata(
      fileId,
      updateFileMetadataDTO,
      sourceLastUpdateTime
    )
  }
}
