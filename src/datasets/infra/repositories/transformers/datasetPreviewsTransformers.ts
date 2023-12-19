import { AxiosResponse } from 'axios';
import { DatasetPreview } from '../../../domain/models/DatasetPreview';
import { DatasetVersionState } from '../../../domain/models/Dataset';

export const transformDatasetPreviewsResponseToPreviews = (response: AxiosResponse): DatasetPreview[] => {
  const datasetPreviews: DatasetPreview[] = [];
  const datasetPreviewsPayload = response.data.data.items;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  datasetPreviewsPayload.forEach(function (datasetPreviewPayload: any) {
    datasetPreviews.push(transformDatasetPreviewPayloadToDatasetPreview(datasetPreviewPayload));
  });
  return datasetPreviews;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformDatasetPreviewPayloadToDatasetPreview = (datasetPreviewPayload: any): DatasetPreview => {
  return {
    persistentId: datasetPreviewPayload.global_id,
    title: datasetPreviewPayload.name,
    versionId: datasetPreviewPayload.versionId,
    versionInfo: {
      majorNumber: datasetPreviewPayload.majorVersion,
      minorNumber: datasetPreviewPayload.minorVersion,
      state: datasetPreviewPayload.versionState as DatasetVersionState,
      createTime: new Date(datasetPreviewPayload.createdAt),
      lastUpdateTime: new Date(datasetPreviewPayload.updatedAt),
      ...(datasetPreviewPayload.published_at && { releaseTime: new Date(datasetPreviewPayload.published_at) }),
    },
    citation: datasetPreviewPayload.citation,
    description: datasetPreviewPayload.description,
  };
};
