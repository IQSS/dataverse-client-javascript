import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class UploadFile implements UseCase<void> {
  private filesRepository: IFilesRepository
  private directUploadClient: IDirectUploadClient

  constructor(filesRepository: IFilesRepository, directUploadClient: IDirectUploadClient) {
    this.filesRepository = filesRepository
    this.directUploadClient = directUploadClient
  }

  /**
   * TODO
   * @returns {Promise<void>}
   */
  async execute(datasetId: number | string, file: File): Promise<void> {
    const fileUploadDestination = await this.filesRepository.getFileUploadDestination(
      datasetId,
      file
    )
    await this.directUploadClient.uploadFile(datasetId, file, fileUploadDestination)
  }
}
