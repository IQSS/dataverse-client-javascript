import { AxiosResponse } from 'axios'
import { transformTreeResponseToFileTreePage } from '../../../src/datasets/infra/repositories/transformers/fileTreeTransformers'
import { FileTreeInclude, FileTreeOrder } from '../../../src/datasets/domain/models/FileTreePage'
import {
  FileTreeNodeType,
  isFileTreeFolderNode,
  isFileTreeFileNode
} from '../../../src/datasets/domain/models/FileTreeNode'

const buildResponse = (data: unknown): AxiosResponse =>
  ({
    data: { data },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never
  } as AxiosResponse)

describe('transformTreeResponseToFileTreePage', () => {
  test('maps folder and file payloads to typed FileTreeNodes', () => {
    const response = buildResponse({
      path: 'data',
      items: [
        {
          type: 'folder',
          name: 'raw',
          path: 'data/raw',
          counts: {
            files: 3,
            folders: 0,
            bytes: 4096,
            restricted: 0,
            embargoed: 0,
            retentionExpired: 0
          }
        },
        {
          type: 'file',
          id: 42,
          name: 'a.csv',
          path: 'data/a.csv',
          size: 1024,
          contentType: 'text/csv',
          access: 'public',
          checksum: { type: 'MD5', value: 'abc' },
          downloadUrl: '/api/access/datafile/42'
        }
      ],
      nextCursor: 'eyJ',
      limit: 100,
      order: 'NameAZ',
      include: 'all',
      approximateCount: 2
    })

    const page = transformTreeResponseToFileTreePage(response)
    expect(page.path).toBe('data')
    expect(page.items).toHaveLength(2)
    expect(page.nextCursor).toBe('eyJ')
    expect(page.limit).toBe(100)
    expect(page.order).toBe(FileTreeOrder.NAME_AZ)
    expect(page.include).toBe(FileTreeInclude.ALL)
    expect(page.approximateCount).toBe(2)

    const folder = page.items[0]
    if (!isFileTreeFolderNode(folder)) {
      throw new Error('expected folder')
    }
    expect(folder.name).toBe('raw')
    expect(folder.counts).toEqual({
      files: 3,
      folders: 0,
      bytes: 4096,
      restricted: 0,
      embargoed: 0,
      retentionExpired: 0
    })

    const file = page.items[1]
    if (!isFileTreeFileNode(file)) {
      throw new Error('expected file')
    }
    expect(file.id).toBe(42)
    expect(file.size).toBe(1024)
    expect(file.access).toBe('public')
    expect(file.checksum).toEqual({ type: 'MD5', value: 'abc' })
  })

  test('falls back to defaults when order/include are unrecognized', () => {
    const response = buildResponse({
      path: '',
      items: [],
      nextCursor: null,
      limit: 100,
      order: 'WhateverElse',
      include: 'something'
    })
    const page = transformTreeResponseToFileTreePage(response)
    expect(page.order).toBe(FileTreeOrder.NAME_AZ)
    expect(page.include).toBe(FileTreeInclude.ALL)
  })

  test('parses non-default order/include echoed by the server', () => {
    const response = buildResponse({
      path: 'docs',
      items: [
        {
          type: 'file',
          id: 1,
          name: 'README.md',
          path: 'docs/README.md',
          size: 200,
          downloadUrl: '/api/access/datafile/1'
        }
      ],
      nextCursor: null,
      limit: 100,
      order: 'NameZA',
      include: 'files'
    })

    const page = transformTreeResponseToFileTreePage(response)
    expect(page.order).toBe(FileTreeOrder.NAME_ZA)
    expect(page.include).toBe(FileTreeInclude.FILES)
    expect(page.items[0].type).toBe(FileTreeNodeType.FILE)
  })
})
