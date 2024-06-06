import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'

export class UploadFile implements UseCase<void> {
  private directUploadClient: IDirectUploadClient

  constructor(directUploadClient: IDirectUploadClient) {
    this.directUploadClient = directUploadClient
  }

  /**
   * TODO
   * @returns {Promise<void>}
   */
  async execute(
    datasetId: number | string, 
    file: File, 
    progress: (now: number) => void, 
    abortController: AbortController
  ): Promise<void> {
    await this.directUploadClient.uploadFile(datasetId, file, progress, abortController)
  }
}
