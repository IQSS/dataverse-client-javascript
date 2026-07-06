import { FileTreeNode } from './FileTreeNode'

export enum FileTreeInclude {
  ALL = 'all',
  FOLDERS = 'folders',
  FILES = 'files'
}

export enum FileTreeOrder {
  NAME_AZ = 'NameAZ',
  NAME_ZA = 'NameZA'
}

export interface FileTreePage {
  path: string
  items: FileTreeNode[]
  nextCursor: string | null
  limit: number
  order: FileTreeOrder
  include: FileTreeInclude
  /**
   * Total folders + files at the requested path. Snapshotted on the
   * first page of a pagination walk and carried unchanged through the
   * cursor for the rest of the walk — on draft versions, files added
   * mid-walk are not reflected until a new walk starts.
   */
  approximateCount?: number
}
