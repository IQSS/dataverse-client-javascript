import { AxiosResponse } from 'axios';
import { FileDataTable } from '../../../domain/models/FileDataTable';

export const transformDataTablesResponseToDataTables = (response: AxiosResponse): FileDataTable[] => {
  const files: FileDataTable[] = [];
  const fileDataTablesPayload = response.data.data;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  fileDataTablesPayload.forEach(function (fileDataTablePayload: any) {
    files.push(transformFileDataTablePayloadToFileDataTable(fileDataTablePayload));
  });
  return files;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformFileDataTablePayloadToFileDataTable = (filePayload: any): FileDataTable => {
  return {};
};
