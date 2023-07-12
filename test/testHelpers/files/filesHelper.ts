import { File } from '../../../src/files/domain/models/File';

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
    checksum: {
      type: 'md5',
      value: '29e413e0c881e17314ce8116fed4d1a7',
    },
    metadataId: 4,
    creationDate: new Date('2023-07-11'),
  };
};

export const createFilePayload = (): any => {
  return {
    label: 'test',
    restricted: false,
    version: 1,
    datasetVersionId: 2,
    dataFile: {
      id: 5,
      persistentId: '',
      filename: 'test',
      contentType: 'image/png',
      filesize: 127426,
      restricted: false,
      storageIdentifier: 'local://18945a85439-9fa52783e5cb',
      rootDataFileId: 4,
      previousDataFileId: 4,
      md5: '29e413e0c881e17314ce8116fed4d1a7',
      checksum: {
        type: 'MD5',
        value: '29e413e0c881e17314ce8116fed4d1a7',
      },
      fileMetadataId: 4,
      creationDate: '2023-07-11',
      varGroups: [],
    },
  };
};