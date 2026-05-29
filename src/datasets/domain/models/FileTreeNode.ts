export enum FileTreeNodeType {
  FOLDER = 'folder',
  FILE = 'file'
}

export interface FileTreeFolderNode {
  type: FileTreeNodeType.FOLDER
  name: string
  path: string
  counts?: {
    /** Total files anywhere in the folder's subtree (recursive). */
    files: number
    /** Immediate subfolders only. */
    folders: number
    /**
     * Total size of all files in the subtree, in bytes. Uses the
     * default-form file size — for ingested tabular files that's the
     * converted TSV, not the original. Intended as a UX hint
     * ("downloading this folder = N GB"); not authoritative under
     * `originals=true`.
     */
    bytes: number
    /**
     * Files in the subtree marked restricted. Mirrors the per-file
     * `access` resolution: a row that is both restricted and embargoed
     * is counted here, not in `embargoed`.
     */
    restricted: number
    /**
     * Non-restricted files in the subtree whose embargo has not yet
     * lapsed. The "public" count is implied: `files - restricted -
     * embargoed`.
     */
    embargoed: number
  }
}

export interface FileTreeFileNode {
  type: FileTreeNodeType.FILE
  id: number
  name: string
  path: string
  /**
   * File size in bytes. For ingested tabular files this is the
   * served-form (converted TSV) size by default; when the listing was
   * requested with `originals=true` it is the saved original's size,
   * matching the bytes `downloadUrl` then serves.
   */
  size: number
  contentType?: string
  access?: 'public' | 'restricted' | 'embargoed'
  checksum?: {
    type: string
    value: string
  }
  downloadUrl: string
}

export type FileTreeNode = FileTreeFolderNode | FileTreeFileNode

export const isFileTreeFolderNode = (node: FileTreeNode): node is FileTreeFolderNode =>
  node.type === FileTreeNodeType.FOLDER

export const isFileTreeFileNode = (node: FileTreeNode): node is FileTreeFileNode =>
  node.type === FileTreeNodeType.FILE
