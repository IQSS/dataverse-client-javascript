import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UploadedFileDTO } from '../dtos/UploadedFileDTO'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class AddUploadedFilesToDataset implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Adds files that have been uploaded to remote storage to the dataset.
   *
   * This method completes the flow initiated by the UploadFile use case, which involves adding the uploaded file to the specified dataset.
   * (https://guides.dataverse.org/en/latest/developers/s3-direct-upload-api.html#adding-the-uploaded-file-to-the-dataset)
   *
   * Note: This use case can be used independently of the UploadFile use case, e.g., supporting scenarios in which the files already exist in S3 or have been uploaded via some out-of-band method.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers) or a number (for numeric identifiers).
   * @param {UploadedFileDTO[]} [uploadedFileDTOs] - File DTOs associated with the uploaded files.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully added to the dataset.
   * @throws {DirectUploadClientError} - If there are errors while performing the operation.
   */
  async execute(datasetId: number | string, uploadedFileDTOs: UploadedFileDTO[]): Promise<void> {
    await this.filesRepository.addUploadedFilesToDataset(datasetId, uploadedFileDTOs)
  }
}
