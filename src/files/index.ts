import { FilesRepository } from './infra/repositories/FilesRepository';
import { GetDatasetFiles } from './domain/useCases/GetDatasetFiles';
import { GetDatasetFileCounts } from './domain/useCases/GetDatasetFileCounts';
import { GetFileDownloadCount } from './domain/useCases/GetFileDownloadCount';
import { GetFileUserPermissions } from './domain/useCases/GetFileUserPermissions';
import { GetFileDataTables } from './domain/useCases/GetFileDataTables';

const filesRepository = new FilesRepository();

const getDatasetFiles = new GetDatasetFiles(filesRepository);
const getDatasetFileCounts = new GetDatasetFileCounts(filesRepository);
const getFileDownloadCount = new GetFileDownloadCount(filesRepository);
const getFileUserPermissions = new GetFileUserPermissions(filesRepository);
const getFileDataTables = new GetFileDataTables(filesRepository);

export { getDatasetFiles, getFileDownloadCount, getFileUserPermissions, getFileDataTables, getDatasetFileCounts };

export { File, FileEmbargo, FileChecksum } from './domain/models/File';
export { FileUserPermissions } from './domain/models/FileUserPermissions';
export { FileCriteria, FileOrderCriteria, FileAccessStatus } from './domain/models/FileCriteria';
export { FileCounts, FileContentTypeCount, FileAccessStatusCount, FileCategoryCount } from './domain/models/FileCounts';
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
