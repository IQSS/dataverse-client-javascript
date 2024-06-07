import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'

export class AddUploadedFileToDataset implements UseCase<void> {
  private directUploadClient: IDirectUploadClient

  constructor(directUploadClient: IDirectUploadClient) {
    this.directUploadClient = directUploadClient
  }

  /**
   * TODO
   * @returns {Promise<void>}
   */
  async execute(datasetId: number | string, file: File, storageId: string): Promise<void> {
    await this.directUploadClient.addUploadedFileToDataset(datasetId, file, storageId)
  }
}
