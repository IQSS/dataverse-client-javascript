export enum FileTreeNodeType {
  FOLDER = 'folder',
  FILE = 'file'
}

export interface FileTreeFolderNode {
  type: FileTreeNodeType.FOLDER
  name: string
  path: string
  counts?: {
    files: number
    folders: number
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
