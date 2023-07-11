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
  };
};

export const createFilePayload = (): any => {
  // TODO
  return {};
};
