import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'

export class UploadFile implements UseCase<string> {
  private directUploadClient: IDirectUploadClient

  constructor(directUploadClient: IDirectUploadClient) {
    this.directUploadClient = directUploadClient
  }

  /**
   * TODO
   * @returns {Promise<string>}
   */
  async execute(
    datasetId: number | string,
    file: File,
    progress: (now: number) => void,
    abortController: AbortController
  ): Promise<string> {
    return await this.directUploadClient.uploadFile(datasetId, file, progress, abortController)
  }
}
