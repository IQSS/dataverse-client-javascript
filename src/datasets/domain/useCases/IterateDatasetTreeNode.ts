import { IDatasetsRepository, ListDatasetTreeNodeParams } from '../repositories/IDatasetsRepository'
import { FileTreeNode } from '../models/FileTreeNode'

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
      const nextCursor = page.nextCursor ?? undefined
      if (nextCursor !== undefined && nextCursor === cursor) {
        throw new Error(
          `Dataset tree pagination cursor did not advance ("${nextCursor}"); aborting iteration`
        )
      }
      cursor = nextCursor
    } while (cursor !== undefined)
  }
}
