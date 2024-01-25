import {assert, createSandbox, SinonSandbox} from "sinon";
import {createFileModel} from "../../testHelpers/files/filesHelper";
import {IFilesRepository} from "../../../src/files/domain/repositories/IFilesRepository";
import {ReadError} from "../../../src";
import {GetFileDraft} from "../../../src/files/domain/useCases/GetFileDraft";

describe('execute', () => {
    const sandbox: SinonSandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test('should return file draft on repository success when passing numeric id', async () => {
        const testFile = createFileModel();
        const filesRepositoryStub = <IFilesRepository>{};
        const getFileDraftStub = sandbox.stub().returns(testFile);
        filesRepositoryStub.getFileDraft = getFileDraftStub;
        const sut = new GetFileDraft(filesRepositoryStub);

        const actual = await sut.execute(1);

        assert.match(actual, testFile);
        assert.calledWithExactly(getFileDraftStub, 1);
    })

    test('should return file draft on repository success when passing string id', async () => {
        const testFile = createFileModel();
        const filesRepositoryStub = <IFilesRepository>{};
        const getFileDraftStub = sandbox.stub().returns(testFile);
        filesRepositoryStub.getFileDraft = getFileDraftStub;
        const sut = new GetFileDraft(filesRepositoryStub);

        const actual = await sut.execute('doi:10.5072/FK2/J8SJZB');

        assert.match(actual, testFile);
        assert.calledWithExactly(getFileDraftStub, 'doi:10.5072/FK2/J8SJZB');
    })

    test('should return error result on repository error', async () => {
        const filesRepositoryStub = <IFilesRepository>{};
        const testReadError = new ReadError();
        filesRepositoryStub.getFileDraft = sandbox.stub().throwsException(testReadError);
        const sut = new GetFileDraft(filesRepositoryStub);

        let actualError: ReadError = undefined;
        await sut.execute(1).catch((e) => (actualError = e));

        assert.match(actualError, testReadError);
    })
});