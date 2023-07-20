import { GetFilesByDatasetId } from './domain/useCases/GetFilesByDatasetId';
import { GetFilesByDatasetPersistentId } from './domain/useCases/GetFilesByDatasetPersistentId';
import { FilesRepository } from './infra/repositories/FilesRepository';
import { GetFileGuestbookResponsesCount } from './domain/useCases/GetFileGuestbookResponsesCount';

const filesRepository = new FilesRepository();

const getFilesByDatasetId = new GetFilesByDatasetId(filesRepository);
const getFilesByDatasetPersistentId = new GetFilesByDatasetPersistentId(filesRepository);
const getFileGuestbookResponsesCount = new GetFileGuestbookResponsesCount(filesRepository);

export { getFilesByDatasetId, getFilesByDatasetPersistentId, getFileGuestbookResponsesCount };

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
