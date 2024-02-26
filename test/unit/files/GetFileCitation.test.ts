import {assert, createSandbox, SinonSandbox} from "sinon";
import {DatasetNotNumberedVersion, ReadError} from "../../../src";
import {IFilesRepository} from "../../../src/files/domain/repositories/IFilesRepository";
import {GetFileCitation} from "../../../src/files/domain/useCases/GetFileCitation";

describe('execute', () => {
    const sandbox: SinonSandbox = createSandbox();
    const testId = 1;

    afterEach(() => {
        sandbox.restore();
    });

    test('should return successful result with file citation on repository success', async () => {
        const testCitation = 'test citation';
        const filesRepositoryStub = <IFilesRepository>{};
        const getFileCitation = sandbox.stub().returns(testCitation);
        filesRepositoryStub.getFileCitation = getFileCitation;

        const sut = new GetFileCitation(filesRepositoryStub);

        const actual = await sut.execute(testId);

        assert.match(actual, testCitation);
        assert.calledWithExactly(getFileCitation, testId, DatasetNotNumberedVersion.LATEST, false);
    });

    test('should return error result on repository error', async () => {
        const filesRepositoryStub = <IFilesRepository>{};
        const testReadError = new ReadError();
        filesRepositoryStub.getFileCitation = sandbox.stub().throwsException(testReadError);
        const sut = new GetFileCitation(filesRepositoryStub);

        let actualError: ReadError = undefined;
        await sut.execute(testId).catch((e) => (actualError = e));

        assert.match(actualError, testReadError);
    });
})