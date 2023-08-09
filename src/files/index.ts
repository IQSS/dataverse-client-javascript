import { FilesRepository } from './infra/repositories/FilesRepository';
import { GetDatasetFiles } from './domain/useCases/GetDatasetFiles';
import { GetFileDownloadCount } from './domain/useCases/GetFileDownloadCount';
import { GetFileDataTables } from './domain/useCases/GetFileDataTables';

const filesRepository = new FilesRepository();

const getDatasetFiles = new GetDatasetFiles(filesRepository);
const getFileDownloadCount = new GetFileDownloadCount(filesRepository);
const getFileDataTables = new GetFileDataTables(filesRepository);

export { getDatasetFiles, getFileDownloadCount, getFileDataTables };

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileOrderCriteria } from './domain/models/FileOrderCriteria';
export {
  FileDataTable,
  FileDataVariable,
  FileDataVariableMetadata,
  FileDataVariableInvalidRanges,
  FileDataVariableCategoryMetadata,
  FileDataVariableCategory,
  FileDataVariableIntervalType,
  FileDataVariableFormatType,
} from './domain/models/FileDataTable';
