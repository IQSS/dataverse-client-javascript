import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UploadedFileDTO } from '../dtos/UploadedFileDTO'
import { IFilesRepository } from '../repositories/IFilesRepository'

export class ReplaceFile implements UseCase<void> {
  private filesRepository: IFilesRepository

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  /**
   * Replaces an existing file.
   *
   * This method completes the flow initiated by the UploadFile use case, which involves replacing an existing file with a new one just uploaded.
   * (https://guides.dataverse.org/en/latest/developers/s3-direct-upload-api.html#replacing-an-existing-file-in-the-dataset)
   *
   * Note: This use case can be used independently of the UploadFile use case, e.g., supporting scenarios in which the files already exist in S3 or have been uploaded via some out-of-band method.
   *
   * @param {number} [fileId] - The File identifier.
   * @param {UploadedFileDTO} [uploadedFileDTO] - File DTO associated with the uploaded file.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully replaced.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(fileId: number, uploadedFileDTO: UploadedFileDTO): Promise<void> {
    await this.filesRepository.replaceFile(fileId, uploadedFileDTO)
  }
}
