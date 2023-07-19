import { File } from '../../../src/files/domain/models/File';
import axios, { AxiosResponse } from 'axios';
import { TestConstants } from '../TestConstants';
import { readFile } from 'fs/promises';

export const createFileModel = (): File => {
  return {
    id: 1,
    persistentId: '',
    name: 'test',
    sizeBytes: 127426,
    version: 1,
    restricted: false,
    contentType: 'image/png',
    storageIdentifier: 'local://18945a85439-9fa52783e5cb',
    rootDataFileId: 4,
    previousDataFileId: 4,
    md5: '29e413e0c881e17314ce8116fed4d1a7',
    metadataId: 4,
    creationDate: new Date('2023-07-11'),
    embargo: {
      dateAvailable: new Date('2023-07-11'),
      reason: 'test',
    },
    checksum: {
      type: 'MD5',
      value: '29e413e0c881e17314ce8116fed4d1a7',
    },
  };
};

export const createFilePayload = (): any => {
  return {
    label: 'test',
    restricted: false,
    version: 1,
    datasetVersionId: 2,
    dataFile: {
      id: 1,
      persistentId: '',
      filename: 'test',
      contentType: 'image/png',
      filesize: 127426,
      storageIdentifier: 'local://18945a85439-9fa52783e5cb',
      rootDataFileId: 4,
      previousDataFileId: 4,
      md5: '29e413e0c881e17314ce8116fed4d1a7',
      fileMetadataId: 4,
      creationDate: '2023-07-11',
      varGroups: [],
      embargo: {
        dateAvailable: '2023-07-11',
        reason: 'test',
      },
      checksum: {
        type: 'MD5',
        value: '29e413e0c881e17314ce8116fed4d1a7',
      },
    },
  };
};

export const uploadFileViaApi = async (datasetId: number, fileName: string): Promise<AxiosResponse> => {
  const formData = new FormData();
  const file = await readFile(`${__dirname}/${fileName}`);
  formData.append('file', new Blob([file]), fileName);
  return await axios.post(`${TestConstants.TEST_API_URL}/datasets/${datasetId}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Dataverse-Key': process.env.TEST_API_KEY,
    },
  });
};
