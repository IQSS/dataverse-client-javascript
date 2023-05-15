import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';

describe('getDatasetSummaryFieldNames', () => {
  // TODO: Change API URL to another of an integration test oriented Dataverse instance
  const sut: DatasetsRepository = new DatasetsRepository();

  ApiConfig.init('https://demo.dataverse.org/api/v1');

  test('should return dataset field names', async () => {
    // TODO
  });
});
