import { File } from '../../../src/files/domain/models/File'
import axios, { AxiosResponse } from 'axios'
import { TestConstants } from '../TestConstants'
import { readFile } from 'fs/promises'
import { FilesSubset } from '../../../src/files/domain/models/FilesSubset'
import { DvObjectType } from '../../../src/core/domain/models/DvObjectOwnerNode'
import { FilePayload } from '../../../src/files/infra/repositories/transformers/FilePayload'

interface FileMetadata {
  categories?: string[]
}

export const createFileModel = (): File => {
  return {
    id: 1,
    persistentId: '',
    name: 'test',
    sizeBytes: 127426,
    version: 1,
    restricted: false,
    latestRestricted: false,
    contentType: 'image/png',
    friendlyType: 'PNG Image',
    storageIdentifier: 'local://18945a85439-9fa52783e5cb',
    rootDataFileId: 4,
    previousDataFileId: 4,
    md5: '29e413e0c881e17314ce8116fed4d1a7',
    metadataId: 4,
    creationDate: new Date('2023-07-11'),
    embargo: {
      dateAvailable: new Date('2023-07-11'),
      reason: 'test'
    },
    checksum: {
      type: 'MD5',
      value: '29e413e0c881e17314ce8116fed4d1a7'
    },
    deleted: false,
    tabularData: false,
    fileAccessRequest: true,
    isPartOf: {
      type: DvObjectType.DATASET,
      identifier: '223',
      persistentIdentifier: 'doi:10.5072/FK2/HEGZLV',
      version: 'DRAFT',
      displayName: 'First Dataset',
      isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
    },
    description: 'description',
    directoryLabel: 'directoryLabel',
    datasetVersionId: 1,
    originalFormat: 'originalFormat',
    originalSize: 127426,
    originalName: 'originalName',
    tabularTags: ['tag1', 'tag2'],
    publicationDate: new Date('2023-07-11')
  }
}

export const createManyFilesModel = (amount: number): File[] => {
  return Array.from({ length: amount }, () => createFileModel())
}

export const createFilesSubsetModel = (amount: number): FilesSubset => {
  return {
    files: createManyFilesModel(amount),
    totalFilesCount: amount
  }
}

export const createFilePayload = (): FilePayload => {
  return {
    label: 'test',
    restricted: false,
    version: 1,
    datasetVersionId: 2,
    dataFile: {
      id: 1,
      version: 1,
      persistentId: '',
      filename: 'test',
      contentType: 'image/png',
      friendlyType: 'PNG Image',
      filesize: 127426,
      storageIdentifier: 'local://18945a85439-9fa52783e5cb',
      restricted: false,
      rootDataFileId: 4,
      previousDataFileId: 4,
      md5: '29e413e0c881e17314ce8116fed4d1a7',
      fileMetadataId: 4,
      creationDate: '2023-07-11',
      embargo: {
        dateAvailable: '2023-07-11',
        reason: 'test'
      },
      checksum: {
        type: 'MD5',
        value: '29e413e0c881e17314ce8116fed4d1a7'
      },
      deleted: false,
      tabularData: false,
      fileAccessRequest: true,
      isPartOf: {
        type: DvObjectType.DATASET,
        identifier: '223',
        persistentIdentifier: 'doi:10.5072/FK2/HEGZLV',
        version: 'DRAFT',
        displayName: 'First Dataset',
        isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
      },
      description: 'description',
      directoryLabel: 'directoryLabel',
      datasetVersionId: 1,
      originalFormat: 'originalFormat',
      originalSize: 127426,
      originalName: 'originalName',
      tabularTags: ['tag1', 'tag2'],
      publicationDate: '2023-07-11'
    }
  }
}

export const createManyFilesPayload = (amount: number): FilePayload[] => {
  return Array.from({ length: amount }, () => createFilePayload())
}

export const uploadFileViaApi = async (
  datasetId: number,
  fileName: string,
  fileMetadata?: FileMetadata
): Promise<AxiosResponse> => {
  const formData = new FormData()
  const file = await readFile(`${__dirname}/${fileName}`)

  formData.append('file', new Blob([file]), fileName)

  if (fileMetadata) {
    formData.append('jsonData', JSON.stringify(fileMetadata))
  }

  return await axios.post(`${TestConstants.TEST_API_URL}/datasets/${datasetId}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Dataverse-Key': process.env.TEST_API_KEY
    }
  })
}

export const registerFileViaApi = async (fileId: number): Promise<AxiosResponse> => {
  return await enableFilePIDs().then(() =>
    axios.get(`${TestConstants.TEST_API_URL}/admin/${fileId}/registerDataFile`, {
      headers: {
        'X-Dataverse-Key': process.env.TEST_API_KEY
      }
    })
  )
}

const enableFilePIDs = async (): Promise<AxiosResponse> => {
  return await axios
    .put(
      `${TestConstants.TEST_API_URL}/admin/settings/:AllowEnablingFilePIDsPerCollection`,
      'true',
      {
        headers: {
          'X-Dataverse-Key': process.env.TEST_API_KEY
        }
      }
    )
    .then(() =>
      axios.put(
        `${TestConstants.TEST_API_URL}/dataverses/root/attribute/filePIDsEnabled?value=true`,
        {},
        {
          headers: {
            'X-Dataverse-Key': process.env.TEST_API_KEY
          }
        }
      )
    )
}
