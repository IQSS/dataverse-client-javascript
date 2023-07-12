import { File } from '../../../domain/models/File';
import { AxiosResponse } from 'axios';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const transformFilesResponseToFiles = (response: AxiosResponse): File[] => {
  const files: File[] = [];
  const filesPayload = response.data.data;
  filesPayload.forEach(function (filePayload: any) {
    files.push(transformFilePayloadToFile(filePayload));
  });
  return files;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformFilePayloadToFile = (filePayload: any): File => {
  return {
    id: filePayload.dataFile.id,
    persistentId: filePayload.dataFile.persistentId,
    name: filePayload.dataFile.filename,
    pidURL: filePayload.dataFile.pidURL,
    sizeBytes: filePayload.dataFile.filesize,
    version: 1,
    description: filePayload.dataFile.description,
    //
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

// MODEL
// id: number;
// persistentId: string;
// name: string;
// pidURL?: string;
// sizeBytes: number;
// version: number;
// description?: string;
// restricted: boolean;
// directoryLabel?: string;
// datasetVersionId?: number;
// categories?: string[];
// contentType: string;
// embargo?: FileEmbargo;
// storageIdentifier?: string;
// originalFormat?: string;
// originalFormatLabel?: string;
// originalSize?: number;
// originalName?: string;
// UNF?: string;
// rootDataFileId?: number;
// previousDataFileId?: number;
// md5?: string;
// checksum?: FileChecksum;
// metadataId?: number;
// tabularTags?: string[];
// creationDate?: Date;
// publicationDate?: Date;

// PAYLOAD
// {
//   label: 'test',
//   restricted: false,
//   version: 1,
//   datasetVersionId: 2,
//   dataFile: {
//     id: 5,
//     persistentId: '',
//     filename: 'test',
//     contentType: 'image/png',
//     filesize: 127426,
//     restricted: false,
//     storageIdentifier: 'local://18945a85439-9fa52783e5cb',
//     rootDataFileId: 4,
//     previousDataFileId: 4,
//     md5: '29e413e0c881e17314ce8116fed4d1a7',
//     checksum: {
//       type: 'MD5',
//       value: '29e413e0c881e17314ce8116fed4d1a7',
//     },
//     fileMetadataId: 4,
//     creationDate: '2023-07-11',
//     varGroups: [],
//   },
// };
