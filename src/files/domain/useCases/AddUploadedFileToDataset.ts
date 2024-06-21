import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'

export class AddUploadedFileToDataset implements UseCase<void> {
  private directUploadClient: IDirectUploadClient

  constructor(directUploadClient: IDirectUploadClient) {
    this.directUploadClient = directUploadClient
  }

  /**
   * Adds a file that has been uploaded to remote storage to the dataset.
   *
   * This method completes the flow initiated by the UploadFile use case, which involves adding the uploaded file to the specified dataset.
   * (https://guides.dataverse.org/en/latest/developers/s3-direct-upload-api.html#adding-the-uploaded-file-to-the-dataset)
   *
   * Note: This use case can be used independently of the UploadFile use case, e.g., supporting scenarios in which the file already exists in S3 or has been uploaded via some out-of-band method.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers) or a number (for numeric identifiers).
   * @param {File} [file] - The file object that has been uploaded.
   * @param {string} [storageId] - The storage identifier associated with the uploaded file.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully added to the dataset.
   *
   */
  async execute(datasetId: number | string, file: File, storageId: string): Promise<void> {
    await this.directUploadClient.addUploadedFileToDataset(datasetId, file, storageId)
  }
}
