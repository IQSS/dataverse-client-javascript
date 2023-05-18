import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';

describe('getDatasetSummaryFieldNames', () => {
  // TODO: Change API URL to another of an integration test oriented Dataverse instance
  ApiConfig.init('https://demo.dataverse.org/api/v1');

  test('should return dataset field names', async () => {
    // TODO
  });
});

// TODO: getDataset tests
