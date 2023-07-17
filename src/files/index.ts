import { GetFilesByDatasetId } from './domain/useCases/GetFilesByDatasetId';
import { GetFilesByDatasetPersistentId } from './domain/useCases/GetFilesByDatasetPersistentId';
import { FilesRepository } from './infra/repositories/FilesRepository';

const filesRepository = new FilesRepository();

const getFilesByDatasetId = new GetFilesByDatasetId(filesRepository);
const getFilesByDatasetPersistentId = new GetFilesByDatasetPersistentId(filesRepository);

export { getFilesByDatasetId, getFilesByDatasetPersistentId };

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
