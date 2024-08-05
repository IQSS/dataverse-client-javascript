import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UploadedFileDTO } from '../dtos/UploadedFileDTO'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class AddUploadedFileToDataset implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
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
   * @param {UploadedFileDTO} [uploadedFileDTO] - A file DTO associated with the uploaded file.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully added to the dataset.
   * @throws {DirectUploadClientError} - If there are errors while performing the operation.
   */
  async execute(datasetId: number | string, uploadedFileDTO: UploadedFileDTO): Promise<void> {
    await this.filesRepository.addUploadedFileToDataset(datasetId, uploadedFileDTO)
  }
}
