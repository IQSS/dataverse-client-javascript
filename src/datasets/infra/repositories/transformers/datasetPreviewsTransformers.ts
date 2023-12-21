import { AxiosResponse } from 'axios';
import { DatasetPreview } from '../../../domain/models/DatasetPreview';
import { DatasetVersionState } from '../../../domain/models/Dataset';

export interface DatasetPreviewPayload {
  global_id: string;
  name: string;
  versionId: number;
  majorVersion: number;
  minorVersion: number;
  versionState: string;
  createdAt: string;
  updatedAt: string;
  published_at?: string;
  citation: string;
  description: string;
}

export const transformDatasetPreviewsResponseToPreviews = (response: AxiosResponse): DatasetPreview[] => {
  const datasetPreviews: DatasetPreview[] = [];
  const datasetPreviewsPayload = response.data.data.items;
  datasetPreviewsPayload.forEach(function (datasetPreviewPayload: DatasetPreviewPayload) {
    datasetPreviews.push(transformDatasetPreviewPayloadToDatasetPreview(datasetPreviewPayload));
  });
  return datasetPreviews;
};

const transformDatasetPreviewPayloadToDatasetPreview = (
  datasetPreviewPayload: DatasetPreviewPayload,
): DatasetPreview => {
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
