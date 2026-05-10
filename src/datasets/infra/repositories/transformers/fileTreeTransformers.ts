import { AxiosResponse } from 'axios'
import { FileTreeInclude, FileTreeOrder, FileTreePage } from '../../../domain/models/FileTreePage'
import {
  FileTreeFileNode,
  FileTreeFolderNode,
  FileTreeNode,
  FileTreeNodeType
} from '../../../domain/models/FileTreeNode'

interface FolderItemPayload {
  type: 'folder'
  name: string
  path: string
  counts?: {
    files: number
    folders: number
    bytes: number
    restricted: number
    embargoed: number
  }
}

interface FileItemPayload {
  type: 'file'
  id: number
  name: string
  path: string
  size: number
  contentType?: string
  access?: 'public' | 'restricted' | 'embargoed'
  checksum?: { type: string; value: string }
  downloadUrl: string
}

type ItemPayload = FolderItemPayload | FileItemPayload

interface TreeResponsePayload {
  path: string
  items: ItemPayload[]
  nextCursor: string | null
  limit: number
  order: string
  include: string
  approximateCount?: number
}

const ALLOWED_ORDERS: FileTreeOrder[] = [FileTreeOrder.NAME_AZ, FileTreeOrder.NAME_ZA]
const ALLOWED_INCLUDES: FileTreeInclude[] = [
  FileTreeInclude.ALL,
  FileTreeInclude.FOLDERS,
  FileTreeInclude.FILES
]

export const transformTreeResponseToFileTreePage = (response: AxiosResponse): FileTreePage => {
  const payload = unwrap<TreeResponsePayload>(response.data)
  return {
    path: payload.path,
    items: payload.items.map(transformItem),
    nextCursor: payload.nextCursor,
    limit: payload.limit,
    order: parseOrder(payload.order),
    include: parseInclude(payload.include),
    approximateCount: payload.approximateCount
  }
}

const transformItem = (item: ItemPayload): FileTreeNode => {
  if (item.type === 'folder') {
    return transformFolder(item)
  }
  return transformFile(item)
}

const transformFolder = (item: FolderItemPayload): FileTreeFolderNode => ({
  type: FileTreeNodeType.FOLDER,
  name: item.name,
  path: item.path,
  counts: item.counts
})

const transformFile = (item: FileItemPayload): FileTreeFileNode => ({
  type: FileTreeNodeType.FILE,
  id: item.id,
  name: item.name,
  path: item.path,
  size: item.size,
  contentType: item.contentType,
  access: item.access,
  checksum: item.checksum,
  downloadUrl: item.downloadUrl
})

const parseOrder = (value: string): FileTreeOrder => {
  return (ALLOWED_ORDERS as string[]).includes(value)
    ? (value as FileTreeOrder)
    : FileTreeOrder.NAME_AZ
}

const parseInclude = (value: string): FileTreeInclude => {
  return (ALLOWED_INCLUDES as string[]).includes(value)
    ? (value as FileTreeInclude)
    : FileTreeInclude.ALL
}

const unwrap = <T>(value: { data: T } | T): T => {
  if (value && typeof value === 'object' && 'data' in (value as Record<string, unknown>)) {
    return (value as { data: T }).data
  }
  return value as T
}
