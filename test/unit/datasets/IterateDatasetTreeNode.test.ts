import { IterateDatasetTreeNode } from '../../../src/datasets/domain/useCases/IterateDatasetTreeNode'
import {
  IDatasetsRepository,
  ListDatasetTreeNodeParams
} from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import {
  FileTreeInclude,
  FileTreeOrder,
  FileTreePage
} from '../../../src/datasets/domain/models/FileTreePage'
import { FileTreeNodeType } from '../../../src/datasets/domain/models/FileTreeNode'

const page = (overrides: Partial<FileTreePage>): FileTreePage => ({
  path: '',
  items: [],
  nextCursor: null,
  limit: 100,
  order: FileTreeOrder.NAME_AZ,
  include: FileTreeInclude.ALL,
  ...overrides
})

describe('IterateDatasetTreeNode (unit)', () => {
  test('iterates a single page', async () => {
    const file = {
      type: FileTreeNodeType.FILE,
      id: 1,
      name: 'a.txt',
      path: 'a.txt',
      size: 100,
      downloadUrl: '/api/access/datafile/1'
    }
    const repo: IDatasetsRepository = {} as IDatasetsRepository
    repo.listDatasetTreeNode = jest.fn().mockResolvedValue(page({ items: [file] }))

    const sut = new IterateDatasetTreeNode(repo)
    const collected: (typeof file)[] = []
    for await (const node of sut.execute({ datasetId: 1 })) {
      collected.push(node as typeof file)
    }
    expect(collected.map((n) => n.id)).toEqual([1])
  })

  test('walks the cursor chain until exhausted', async () => {
    const fileFor = (id: number) => ({
      type: FileTreeNodeType.FILE,
      id,
      name: `f${id}.txt`,
      path: `f${id}.txt`,
      size: 100,
      downloadUrl: `/api/access/datafile/${id}`
    })
    const pages: FileTreePage[] = [
      page({ items: [fileFor(1), fileFor(2)], nextCursor: 'c2' }),
      page({ items: [fileFor(3)], nextCursor: 'c3' }),
      page({ items: [fileFor(4)] })
    ]
    const calls: ListDatasetTreeNodeParams[] = []
    const repo: IDatasetsRepository = {} as IDatasetsRepository
    repo.listDatasetTreeNode = jest.fn().mockImplementation((params: ListDatasetTreeNodeParams) => {
      calls.push(params)
      const idx = calls.length - 1
      return Promise.resolve(pages[idx])
    })

    const sut = new IterateDatasetTreeNode(repo)
    const ids: number[] = []
    for await (const node of sut.execute({ datasetId: 1 })) {
      if (node.type === FileTreeNodeType.FILE) {
        ids.push(node.id)
      }
    }
    expect(ids).toEqual([1, 2, 3, 4])
    expect(calls.map((c) => c.cursor)).toEqual([undefined, 'c2', 'c3'])
  })
})
