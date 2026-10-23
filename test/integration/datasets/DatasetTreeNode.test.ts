import { ApiConfig, DataverseApiAuthMechanism } from '../../../src'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  CreatedDatasetIdentifiers,
  DatasetNotNumberedVersion,
  FileTreeFileNode,
  FileTreeFolderNode,
  FileTreeInclude,
  FileTreeNode,
  FileTreeNodeType,
  FileTreeOrder,
  createDataset,
  isFileTreeFileNode,
  isFileTreeFolderNode,
  iterateDatasetTreeNode,
  listDatasetTreeNode
} from '../../../src/datasets'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import {
  createDatasetTreeFixtureViaApi,
  datasetTreeEndpointIsAvailable
} from '../../testHelpers/datasets/datasetTreeHelper'

const describeTree = datasetTreeEndpointIsAvailable() ? describe : describe.skip

describeTree('Dataset tree node listing', () => {
  const testCollectionAlias = 'datasetTreeTestCollection'
  let testDatasetIds: CreatedDatasetIdentifiers

  const names = (items: FileTreeNode[]): string[] => items.map((item) => item.name)

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)
    try {
      testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while creating test dataset')
    }
    await createDatasetTreeFixtureViaApi(testDatasetIds.numericId)
  })

  afterAll(async () => {
    await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
  })

  describe('listDatasetTreeNode', () => {
    test('should list the immediate children of the dataset root, folders before files', async () => {
      const actual = await listDatasetTreeNode.execute({ datasetId: testDatasetIds.numericId })

      expect(actual.path).toBe('')
      expect(actual.limit).toBeGreaterThan(0)
      expect(actual.order).toBe(FileTreeOrder.NAME_AZ)
      expect(actual.include).toBe(FileTreeInclude.ALL)
      expect(actual.nextCursor).toBeNull()
      expect(actual.approximateCount).toBe(3)
      expect(names(actual.items)).toEqual(['data', 'docs', 'root.txt'])

      const dataFolder = actual.items[0] as FileTreeFolderNode
      expect(dataFolder.type).toBe(FileTreeNodeType.FOLDER)
      expect(dataFolder.path).toBe('data')
      expect(dataFolder.counts?.files).toBe(3)
      expect(dataFolder.counts?.folders).toBe(1)
      expect(dataFolder.counts?.bytes).toBeGreaterThan(0)
      expect(dataFolder.counts?.restricted).toBe(0)
      expect(dataFolder.counts?.embargoed).toBe(0)
      expect(dataFolder.counts?.retentionExpired).toBe(0)

      const rootFile = actual.items[2] as FileTreeFileNode
      expect(rootFile.type).toBe(FileTreeNodeType.FILE)
      expect(rootFile.path).toBe('root.txt')
      expect(rootFile.size).toBeGreaterThan(0)
      expect(rootFile.contentType).toBe('text/plain')
      expect(rootFile.access).toBe('public')
      expect(rootFile.checksum?.value).toEqual(expect.any(String))
      expect(rootFile.downloadUrl).toBe(`/api/access/datafile/${rootFile.id}`)
    })

    test('should narrow the type of each returned node through the exported type guards', async () => {
      const actual = await listDatasetTreeNode.execute({ datasetId: testDatasetIds.numericId })

      expect(actual.items.filter(isFileTreeFolderNode).map((folder) => folder.name)).toEqual([
        'data',
        'docs'
      ])
      expect(actual.items.filter(isFileTreeFileNode).map((file) => file.name)).toEqual(['root.txt'])
    })

    test('should list only the immediate children of a nested path', async () => {
      const actual = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        path: 'data'
      })

      expect(actual.path).toBe('data')
      expect(names(actual.items)).toEqual(['sub', 'a.txt', 'b.txt'])
      expect((actual.items[0] as FileTreeFolderNode).path).toBe('data/sub')
      expect((actual.items[1] as FileTreeFileNode).path).toBe('data/a.txt')
    })

    test('should accept a persistent identifier and an explicit version as the dataset coordinates', async () => {
      const actual = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.persistentId,
        datasetVersionId: DatasetNotNumberedVersion.DRAFT
      })

      expect(names(actual.items)).toEqual(['data', 'docs', 'root.txt'])
    })

    test('should return only folders when the include filter asks for folders', async () => {
      const actual = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        include: FileTreeInclude.FOLDERS
      })

      expect(actual.include).toBe(FileTreeInclude.FOLDERS)
      expect(names(actual.items)).toEqual(['data', 'docs'])
      expect(actual.items.every(isFileTreeFolderNode)).toBe(true)
    })

    test('should return only files when the include filter asks for files', async () => {
      const actual = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        include: FileTreeInclude.FILES
      })

      expect(actual.include).toBe(FileTreeInclude.FILES)
      expect(names(actual.items)).toEqual(['root.txt'])
      expect(actual.items.every(isFileTreeFileNode)).toBe(true)
    })

    test('should reverse the name ordering within each node type when descending order is requested', async () => {
      const actual = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        order: FileTreeOrder.NAME_ZA
      })

      expect(actual.order).toBe(FileTreeOrder.NAME_ZA)
      expect(names(actual.items)).toEqual(['docs', 'data', 'root.txt'])
    })

    test('should point the download url at the original form when originals are requested', async () => {
      const actual = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        include: FileTreeInclude.FILES,
        originals: true
      })

      const rootFile = actual.items[0] as FileTreeFileNode
      expect(rootFile.downloadUrl).toBe(`/api/access/datafile/${rootFile.id}?format=original`)
    })

    test('should page through the listing with the server-issued cursor', async () => {
      const firstPage = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        limit: 2
      })

      expect(firstPage.limit).toBe(2)
      expect(names(firstPage.items)).toEqual(['data', 'docs'])
      expect(firstPage.nextCursor).toEqual(expect.any(String))

      const secondPage = await listDatasetTreeNode.execute({
        datasetId: testDatasetIds.numericId,
        limit: 2,
        cursor: firstPage.nextCursor as string
      })

      expect(names(secondPage.items)).toEqual(['root.txt'])
      expect(secondPage.nextCursor).toBeNull()
    })

    test('should throw a ReadError when the cursor was not issued by the server', async () => {
      await expect(
        listDatasetTreeNode.execute({
          datasetId: testDatasetIds.numericId,
          cursor: 'not-a-real-cursor'
        })
      ).rejects.toThrow(ReadError)
    })

    test('should throw a ReadError when the dataset does not exist', async () => {
      await expect(
        listDatasetTreeNode.execute({ datasetId: TestConstants.TEST_DUMMY_PERSISTENT_ID })
      ).rejects.toThrow(ReadError)
    })
  })

  describe('iterateDatasetTreeNode', () => {
    const collect = async (generator: AsyncGenerator<FileTreeNode>): Promise<FileTreeNode[]> => {
      const collected: FileTreeNode[] = []
      for await (const node of generator) {
        collected.push(node)
      }
      return collected
    }

    test('should yield every child of a path, walking the cursor across pages', async () => {
      const actual = await collect(
        iterateDatasetTreeNode.execute({ datasetId: testDatasetIds.numericId, limit: 1 })
      )

      expect(names(actual)).toEqual(['data', 'docs', 'root.txt'])
    })

    test('should yield the same nodes as a single page when the whole listing fits in one', async () => {
      const iterated = await collect(
        iterateDatasetTreeNode.execute({ datasetId: testDatasetIds.numericId })
      )
      const listed = await listDatasetTreeNode.execute({ datasetId: testDatasetIds.numericId })

      expect(iterated).toEqual(listed.items)
    })

    test('should walk a nested path with the include and order options applied to every page', async () => {
      const actual = await collect(
        iterateDatasetTreeNode.execute({
          datasetId: testDatasetIds.numericId,
          path: 'data',
          include: FileTreeInclude.FILES,
          order: FileTreeOrder.NAME_ZA,
          limit: 1
        })
      )

      expect(names(actual)).toEqual(['b.txt', 'a.txt'])
    })

    test('should surface a ReadError from the first page instead of yielding nodes', async () => {
      const generator = iterateDatasetTreeNode.execute({
        datasetId: TestConstants.TEST_DUMMY_PERSISTENT_ID
      })

      await expect(generator.next()).rejects.toThrow(ReadError)
    })
  })
})
