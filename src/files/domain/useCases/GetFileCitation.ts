import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { DatasetNotNumberedVersion } from '../../../datasets';

export class GetFileCitation implements UseCase<string> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    fileId: number,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST_PUBLISHED,
    includeDeaccessioned = false,
  ): Promise<string> {
    return await this.filesRepository.getFileCitation(fileId, datasetVersionId, includeDeaccessioned);
  }
}
