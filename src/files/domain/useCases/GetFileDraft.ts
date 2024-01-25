import { IFilesRepository } from "../repositories/IFilesRepository";
import { File } from "../models/File";

export class GetFileDraft {
    constructor(private readonly filesRepository: IFilesRepository) {}

    async execute(fileId: number | string): Promise<File> {
        return await this.filesRepository.getFileDraft(fileId);
    }
}