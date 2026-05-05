import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository, ListDatasetTreeNodeParams } from '../repositories/IDatasetsRepository'
import { FileTreePage } from '../models/FileTreePage'

export class ListDatasetTreeNode implements UseCase<FileTreePage> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Lists the immediate children of the given folder path inside a dataset
   * version, returning a single page of folders and files.
   *
   * Folders are returned first, then files. Both are sorted by name. Use the
   * returned `nextCursor` to keep paging the same folder. The cursor is
   * opaque to callers and is server-validated; an invalid cursor yields a 400
   * from the API.
   */
  async execute(params: ListDatasetTreeNodeParams): Promise<FileTreePage> {
    return this.datasetsRepository.listDatasetTreeNode(params)
  }
}
