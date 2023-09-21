import {UseCase} from "../../../core/domain/useCases/UseCase";
import {IFilesRepository} from "../repositories/IFilesRepository";
import {DatasetNotNumberedVersion} from "../../../datasets";

export class GetDatasetFilesTotalDownloadSize implements UseCase<number> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(datasetId: number | string,
                datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,): Promise<number> {
    return await this.filesRepository.getDatasetFilesTotalDownloadSize(datasetId, datasetVersionId);
  }
}