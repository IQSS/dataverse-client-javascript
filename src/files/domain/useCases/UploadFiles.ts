import { UseCase } from '../../../core/domain/useCases/UseCase'
import { FileDTO } from '../dtos/FileDTO'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class UploadFiles implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * TODO
   * @returns {Promise<void>}
   */
  async execute(datasetId: number | string, fileDTOs: FileDTO[]): Promise<void> {
    // TODO
    this.filesRepository.getFileUploadDestinations(datasetId, fileDTOs[0].filesize)
  }
}
