import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { DatasetNotNumberedVersion } from '../../../datasets';
import { FileDownloadSizeMode } from '../models/FileDownloadSizeMode';

export class GetDatasetFilesTotalDownloadSize implements UseCase<number> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    fileDownloadSizeMode: FileDownloadSizeMode = FileDownloadSizeMode.ALL,
  ): Promise<number> {
    return await this.filesRepository.getDatasetFilesTotalDownloadSize(
      datasetId,
      datasetVersionId,
      fileDownloadSizeMode,
    );
  }
}
