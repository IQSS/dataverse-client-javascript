import { FilesRepository } from './infra/repositories/FilesRepository';
import { GetDatasetFiles } from './domain/useCases/GetDatasetFiles';
import { GetFileGuestbookResponsesCount } from './domain/useCases/GetFileGuestbookResponsesCount';

const filesRepository = new FilesRepository();

const getDatasetFiles = new GetDatasetFiles(filesRepository);
const getFileGuestbookResponsesCount = new GetFileGuestbookResponsesCount(filesRepository);

export { getDatasetFiles, getFileGuestbookResponsesCount };

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
