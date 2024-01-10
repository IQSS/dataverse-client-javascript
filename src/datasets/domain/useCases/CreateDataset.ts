import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { NewDataset } from '../models/NewDataset';
import { NewResourceValidator } from '../../../core/domain/useCases/validators/NewResourceValidator';

export class CreateDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository;
  private newDatasetValidator: NewResourceValidator<NewDataset>;

  constructor(datasetsRepository: IDatasetsRepository, newDatasetValidator: NewResourceValidator<NewDataset>) {
    this.datasetsRepository = datasetsRepository;
    this.newDatasetValidator = newDatasetValidator;
  }

  async execute(newDataset: NewDataset): Promise<void> {
    return await this.newDatasetValidator.validate(newDataset).then(async () => {
      return await this.datasetsRepository.createDataset(newDataset);
    });
  }
}
