import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';

export class GetFile {
  constructor(private readonly filesRepository: IFilesRepository) {}

  async execute(fileId: number | string): Promise<File> {
    return await this.filesRepository.getFile(fileId);
  }
}
