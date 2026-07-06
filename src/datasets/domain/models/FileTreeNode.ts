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
     * `access` resolution — the buckets are mutually exclusive: a
     * retention-expired file counts in `retentionExpired` even if it is
     * also restricted, and a restricted file counts here even if it
     * also carries an embargo.
     */
    restricted: number
    /**
     * Non-restricted files in the subtree whose embargo has not yet
     * lapsed. The "public" count is implied: `files - restricted -
     * embargoed - retentionExpired`.
     */
    embargoed: number
    /**
     * Files in the subtree whose retention period has expired — they
     * cannot be served at all, so this state wins over `restricted`
     * and `embargoed` in the per-file `access` resolution.
     */
    retentionExpired: number
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
  /**
   * Resolved in this order: `retentionExpired` (the file cannot be
   * served at all), then `restricted` (even when an embargo is also
   * active), then `embargoed`, then `public`. The embargo/retention
   * date checks match Dataverse's download enforcement: a file whose
   * embargo lifts today reports `public` and is downloadable.
   */
  access?: 'public' | 'restricted' | 'embargoed' | 'retentionExpired'
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
