import { FilesRepository } from './infra/repositories/FilesRepository';
import { GetDatasetFiles } from './domain/useCases/GetDatasetFiles';
import { GetFileGuestbookResponsesCount } from './domain/useCases/GetFileGuestbookResponsesCount';
import { CanFileBeDownloaded } from './domain/useCases/CanFileBeDownloaded';

const filesRepository = new FilesRepository();

const getDatasetFiles = new GetDatasetFiles(filesRepository);
const getFileGuestbookResponsesCount = new GetFileGuestbookResponsesCount(filesRepository);
const canFileBeDownloaded = new CanFileBeDownloaded(filesRepository);

export { getDatasetFiles, getFileGuestbookResponsesCount, canFileBeDownloaded };

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
