import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'
import { FileDTO } from '../dtos/FileDTO'
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
  async execute(datasetId: number | string, fileDTOs: FileDTO[]): Promise<void> {
    fileDTOs.map(async fileDTO => {
      const fileUploadDestinations = await this.filesRepository.getFileUploadDestinations(datasetId, fileDTO.filesize)
      await this.directUploadClient.uploadFile(fileDTO, fileUploadDestinations)
    });  
  }
}
