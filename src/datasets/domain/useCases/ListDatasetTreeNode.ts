import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository, ListDatasetTreeNodeParams } from '../repositories/IDatasetsRepository'
import { FileTreePage } from '../models/FileTreePage'

export class ListDatasetTreeNode implements UseCase<FileTreePage> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  async execute(params: ListDatasetTreeNodeParams): Promise<FileTreePage> {
    return this.datasetsRepository.listDatasetTreeNode(params)
  }
}
