import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class UploadFiles implements UseCase<void> {
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
  async execute(datasetId: number | string, files: File[]): Promise<void> {
    files.map(async (file) => {
      const fileUploadDestinations = await this.filesRepository.getFileUploadDestination(
        datasetId,
        file
      )
      await this.directUploadClient.uploadFile(file, fileUploadDestinations)
    })
  }
}
