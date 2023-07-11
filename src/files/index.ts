import { GetFilesByDatasetId } from './domain/useCases/GetFilesByDatasetId';
import { FilesRepository } from './infra/repositories/FilesRepository';

const filesRepository = new FilesRepository();
const getFilesByDatasetId = new GetFilesByDatasetId(filesRepository);

export { getFilesByDatasetId };

export { File } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
