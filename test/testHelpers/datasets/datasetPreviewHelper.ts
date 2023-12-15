import { DatasetPreview } from '../../../src/datasets/domain/models/DatasetPreview';

export const createDatasetPreviewModel = (): DatasetPreview => {
  const datasetPreviewModel: DatasetPreview = {
    id: 1,
    title: 'test'
  }
  return datasetPreviewModel;
};
