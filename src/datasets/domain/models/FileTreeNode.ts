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
  }
}

export interface FileTreeFileNode {
  type: FileTreeNodeType.FILE
  id: number
  name: string
  path: string
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
