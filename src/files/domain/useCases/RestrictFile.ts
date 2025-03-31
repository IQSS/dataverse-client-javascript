import { IFilesRepository } from '../repositories/IFilesRepository'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { RestrictFileDTO } from '../dtos/RestrictFileDTO'
// https://github.com/IQSS/dataverse/pull/11349/files
export class RestrictFile implements UseCase<string> {
  constructor(private readonly filesRepository: IFilesRepository) {}

  /**
   * Restrict or unrestrict an existing file.
   * More detailed information about the file restriction behavior can be found in https://guides.dataverse.org/en/latest/api/native-api.html#restrict-files
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {RestrictFileDTO} [restrictFileDTO] - The DTO containing the file restriction information.
   * @returns {Promise<void>} -This method does not return anything upon successful completion.
   */

  async execute(fileId: number | string, restrictFileDTO: RestrictFileDTO): Promise<string> {
    return await this.filesRepository.restrictFile(fileId, restrictFileDTO)
  }
}
