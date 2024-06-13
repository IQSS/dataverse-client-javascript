import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDirectUploadClient } from '../clients/IDirectUploadClient'

export class UploadFile implements UseCase<string> {
  private directUploadClient: IDirectUploadClient

  constructor(directUploadClient: IDirectUploadClient) {
    this.directUploadClient = directUploadClient
  }

  /**
   * Uploads a file to remote storage and returns the storage identifier.
   *
   * This use case is based on the Direct Upload API, particularly the first part of the flow, "Requesting Direct Upload of a DataFile".
   * To fulfill the flow, you will need to call the AddUploadedFileToDataset Use Case to add the uploaded file to the dataset.
   * (https://guides.dataverse.org/en/latest/developers/s3-direct-upload-api.html#requesting-direct-upload-of-a-datafile)
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers) or a number (for numeric identifiers).
   * @param {File} [file] - The file object to be uploaded.
   * @param {function(number): void} [progress] - A callback function to monitor the upload progress, receiving the current progress as a number.
   * @param {AbortController} [abortController] - An AbortController to manage and abort the upload process if necessary.
   * @returns {Promise<string>} A promise that resolves to the storage identifier of the uploaded file.
   * @throws {DirectUploadClientError} - If there are errors while performing the operation.
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
