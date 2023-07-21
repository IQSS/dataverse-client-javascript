import { FilesRepository } from './infra/repositories/FilesRepository';
import { GetDatasetFiles } from './domain/useCases/GetDatasetFiles';
import { GetFileGuestbookResponsesCount } from './domain/useCases/GetFileGuestbookResponsesCount';
import { CanFileBeDownloaded } from './domain/useCases/CanFileBeDownloaded';
import { GetFileThumbnailClass } from './domain/useCases/GetFileThumbnailClass';
import { GetFileDataTables } from './domain/useCases/GetFileDataTables';

const filesRepository = new FilesRepository();

const getDatasetFiles = new GetDatasetFiles(filesRepository);
const getFileGuestbookResponsesCount = new GetFileGuestbookResponsesCount(filesRepository);
const canFileBeDownloaded = new CanFileBeDownloaded(filesRepository);
const getFileThumbnailClass = new GetFileThumbnailClass(filesRepository);
const getFileDataTables = new GetFileDataTables(filesRepository);

export {
  getDatasetFiles,
  getFileGuestbookResponsesCount,
  canFileBeDownloaded,
  getFileThumbnailClass,
  getFileDataTables,
};

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
export { FileThumbnailClass } from './domain/models/FileThumbnailClass';
export { FileDataTable } from './domain/models/FileDataTable';
