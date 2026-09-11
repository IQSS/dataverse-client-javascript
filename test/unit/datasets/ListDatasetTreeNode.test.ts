import { ListDatasetTreeNode } from '../../../src/datasets/domain/useCases/ListDatasetTreeNode'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import {
  FileTreeInclude,
  FileTreeOrder,
  FileTreePage
} from '../../../src/datasets/domain/models/FileTreePage'
import { FileTreeNodeType } from '../../../src/datasets/domain/models/FileTreeNode'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('ListDatasetTreeNode (unit)', () => {
  const testPage: FileTreePage = {
    path: 'data',
    items: [
      {
        type: FileTreeNodeType.FOLDER,
        name: 'sub',
        path: 'data/sub',
        counts: {
          files: 1,
          folders: 0,
          bytes: 1024,
          restricted: 0,
          embargoed: 0,
          retentionExpired: 0
        }
      },
      {
        type: FileTreeNodeType.FILE,
        id: 7,
        name: 'a.txt',
        path: 'data/a.txt',
        size: 1024,
        downloadUrl: '/api/access/datafile/7'
      }
    ],
    nextCursor: null,
    limit: 100,
    order: FileTreeOrder.NAME_AZ,
    include: FileTreeInclude.ALL,
    approximateCount: 2
  }

  test('returns the page produced by the repository', async () => {
    const repo: IDatasetsRepository = {} as IDatasetsRepository
    repo.listDatasetTreeNode = jest.fn().mockResolvedValue(testPage)

    const sut = new ListDatasetTreeNode(repo)
    const result = await sut.execute({ datasetId: 1, path: 'data' })
    expect(result).toEqual(testPage)
    expect(repo.listDatasetTreeNode).toHaveBeenCalledWith({ datasetId: 1, path: 'data' })
  })

  test('propagates ReadError', async () => {
    const repo: IDatasetsRepository = {} as IDatasetsRepository
    repo.listDatasetTreeNode = jest.fn().mockRejectedValue(new ReadError('[400] bad cursor'))

    const sut = new ListDatasetTreeNode(repo)
    await expect(sut.execute({ datasetId: 1 })).rejects.toThrow(ReadError)
  })
})
