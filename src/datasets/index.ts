import { DatasetsRepository } from './infra/repositories/DatasetsRepository';
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames';

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(new DatasetsRepository());

export { getDatasetSummaryFieldNames };
