import { IDatasetsRepository, ListDatasetTreeNodeParams } from '../repositories/IDatasetsRepository'
import { FileTreeNode } from '../models/FileTreeNode'

/**
 * Async generator that exhaustively iterates the immediate children of the
 * given path inside a dataset version, transparently following the
 * `nextCursor` chain.
 *
 * Use this when you need every direct child of a folder; it does NOT recurse
 * into subfolders — that is the caller's responsibility (e.g. pre-download
 * enumeration walks the tree by re-invoking this iterator with each folder
 * path it discovers).
 */
export class IterateDatasetTreeNode {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  async *execute(params: ListDatasetTreeNodeParams): AsyncGenerator<FileTreeNode> {
    let cursor = params.cursor
    do {
      const page = await this.datasetsRepository.listDatasetTreeNode({
        ...params,
        cursor
      })
      for (const item of page.items) {
        yield item
      }
      cursor = page.nextCursor ?? undefined
    } while (cursor)
  }
}
