# Agent guide: dataverse-client-javascript

This file is the canonical reference for any AI agent or tool working in this repository: Claude Code, GitHub Copilot, or otherwise. Keep it in sync with `.github/copilot-instructions.md` if you update one.

`@iqss/dataverse-client-javascript` is a use-case-driven TypeScript SDK for the [Dataverse API](https://guides.dataverse.org/en/latest/api/native-api.html). It's part of the Dataverse Frontend ecosystem: the `dataverse-frontend` SPA and other consumers import use cases from this package instead of calling the REST API directly. Every public capability is exposed as a `use case` object with an `.execute(...)` method, documented one by one in [docs/useCases.md](docs/useCases.md).

## Layering (Clean Architecture / DDD)

Each top-level domain lives in its own folder under `src/` (`datasets`, `files`, `collections`, `access`, `guestbooks`, `users`, and so on). Inside a domain folder:

```
src/<domain>/
  domain/
    models/          plain TS interfaces, the shapes use cases return
    dtos/            input shapes for write operations
    repositories/    I<Domain>Repository, the interface use cases depend on
    useCases/         one class per use case, implements UseCase<T>, has execute()
  infra/
    repositories/
      <Domain>Repository.ts        implements I<Domain>Repository, extends ApiRepository
      transformers/                raw API JSON to domain model mapping functions
  index.ts           wires everything together (see below)
```

A use case class never talks to axios directly. It depends on the `I<Domain>Repository` interface, constructor-injected, and the concrete `<Domain>Repository` is the only thing that knows the actual REST endpoint shape. That split keeps the unit tests clean: use-case tests stub the repository interface, repository tests mock `axios` and assert the exact URL, params, and headers sent.

Each domain's `index.ts` is the composition root:

```typescript
const datasetsRepository = new DatasetsRepository()
const getDataset = new GetDataset(datasetsRepository)
// one instantiation per use case, all sharing the one repository instance

export { getDataset /* , all other use case instances */ }
export { Dataset, PreviewUrl /* , domain model types consumers need */ } from './domain/models/...'
```

Consumers `import { getDataset } from '@iqss/dataverse-client-javascript'` and call `getDataset.execute(...)`. They get an already-wired singleton, never a class they need to instantiate themselves.

That import works because the exports chain one level further than a single domain's `index.ts`: the package root `src/index.ts` does `export * from './datasets'`, `export * from './files'`, and so on for every domain, and `package.json`'s `main` and `types` fields point at `dist/index.js` and `dist/index.d.ts`, built from that root file by `npm run build` (`tsc`). Adding a new use case to a domain's `index.ts` is enough; nothing else needs updating for it to reach consumers.

Grouping related use cases in a subfolder: when several use cases form one cohesive feature, put them in `domain/useCases/<feature>/` rather than flat in `useCases/`. There's precedent for this beyond a single example: `domain/useCases/validators/` groups the dataset metadata field validators (`MetadataFieldValidator` and friends) that `CreateDataset`/`UpdateDataset` run before submitting, and that throw `ResourceValidationError` when a field value is invalid. Subfolders aren't the default; most use cases sit flat.

## The HTTP layer

- `ApiRepository`, in `src/core/infra/repositories/`, is the base class every `<Domain>Repository` extends. It exposes `doGet`, `doPost`, `doPut`, `doDelete`, thin wrappers around axios.
- `ApiConfig` is a global singleton holding the configured `dataverseApiUrl` and auth mechanism (`API_KEY`, `SESSION_COOKIE`, or `BEARER_TOKEN`), set once via `ApiConfig.init(...)`.
- Every `doGet`/`doPost` call takes an `authRequired: boolean` as an explicit argument. When `true`, `buildRequestConfig` (in `apiConfigBuilders.ts`) attaches whichever credential `ApiConfig` currently holds: an `X-Dataverse-key` header for `API_KEY`, a cookie for `SESSION_COOKIE`, or an `Authorization: Bearer` header for `BEARER_TOKEN`. When `false`, no ambient credential is attached at all, regardless of what's configured.
- Dataverse itself accepts an API key, or any equivalent token, via the `X-Dataverse-key` header or a `?key=` query parameter; either works, for any authenticated endpoint. That equivalence is why token-based access (see Preview URLs below) can be threaded through as a query param without touching the auth-mechanism plumbing at all.

### Gotcha: ambient credentials silently beat an explicit token

If a method hardcodes `authRequired: true` and also accepts a token to put in `?key=`, both go out on the same request: the configured ambient credential in the header, and the token in the query param. Empirically, Dataverse's permission check resolves the ambient-credential identity first; the query-param token is only consulted when the request is otherwise anonymous. So if a caller-supplied token needs to be authoritative, for example a Preview URL token letting an unauthenticated reviewer in, pass `authRequired: someToken === undefined` instead of a hardcoded `true`. Otherwise a caller who happens to have their own unrelated, permissionless credentials configured gets denied even with a perfectly valid token.

### The error model: `ReadError` versus `WriteError`

Both extend `RepositoryError` (`src/core/domain/repositories/RepositoryError.ts`), and the split follows the HTTP method, not the domain: `doGet` failures throw `ReadError`, `doPost`/`doPut`/`doDelete` failures throw `WriteError`. A test asserting `.rejects.toBeInstanceOf(ReadError)` against a failed create or delete call fails for the wrong reason, since that call actually throws `WriteError`. When in doubt, check which `do*` method the repository method under test calls.

## Finding the API spec for a new use case

Before writing any code, pin down the exact endpoint, HTTP method, and payload shape:

1. **Check the official docs first**: [native-api.html](https://guides.dataverse.org/en/latest/api/native-api.html) is the source of truth (also see [dataaccess.html](https://guides.dataverse.org/en/latest/api/dataaccess.html) for file-access endpoints). If the endpoint is documented there, that's the spec.
2. **If it's not documented yet**, because the backend feature landed on `develop` but isn't in a docs release, or is still in review, search open PRs at [github.com/IQSS/dataverse/pulls](https://github.com/IQSS/dataverse/pulls). The PR's description and diff are the spec until the guide catches up.
3. **If you can't find or confidently identify the right PR, ask the user** for the source (a PR link, issue, or discussion thread) rather than guessing at an endpoint's shape from first principles.
4. **To integration-test against a not-yet-merged PR's backend changes**, check the PR's comments for a `github-actions[bot]` message starting "Pushed preview images as": every open Dataverse PR gets one, publishing a temporary Docker image built from that exact branch, for example:
   ```
   ghcr.io/gdcc/dataverse:12535-download-without-guestbook-response-for-preview-user2
   ghcr.io/gdcc/configbaker:12535-download-without-guestbook-response-for-preview-user2
   ```
   `test/environment/docker-compose.yml` already reads its images from `${DATAVERSE_IMAGE_REGISTRY}/gdcc/dataverse:${DATAVERSE_IMAGE_TAG}`, and the equivalent for `configbaker`, defaulted in `test/environment/.env` to `DATAVERSE_IMAGE_REGISTRY=docker.io` and `DATAVERSE_IMAGE_TAG=unstable`. To point a local environment at the PR's temp build instead, override both in `test/environment/.env`:
   ```
   DATAVERSE_IMAGE_REGISTRY=ghcr.io
   DATAVERSE_IMAGE_TAG=<the PR's branch name, exactly as printed in the bot comment>
   ```
   This lets integration tests against the new endpoint pass before the backend PR merges. Revert `.env` back to the `docker.io`/`unstable` defaults once done: CI and everyone else's local runs assume the default image, and a committed PR-specific tag breaks the suite for anyone else once that PR's preview image is cleaned up (GHCR preview images are generally scoped to the PR's lifetime).

## Checking the backend source for complex logic

The API guide states what an endpoint does. It doesn't state precedence rules, edge cases, or exactly how a permission check resolves. For that, read the Java implementation directly at [github.com/IQSS/dataverse](https://github.com/IQSS/dataverse).

Start in `src/main/java/edu/harvard/iq/dataverse/api/`, one class per domain area (`Datasets.java`, `Access.java`, `Files.java`, `Users.java`, and so on). JAX-RS `@Path` annotations map directly onto the REST paths from the guide, so grepping a class for the path segment finds the resource method quickly. Follow that method into whatever `Command` class it executes: Dataverse runs its business logic through a Command pattern, and that's where permission checks and edge-case behavior actually live, not in the resource class itself.

Verified example: `Datasets.java` defines `/datasets/{id}/previewUrl` and the deprecated `/datasets/{id}/privateUrl` as separate `@Path`-annotated methods that delegate to the same implementation (`createPrivateUrl(...)` calls `createPreviewUrl(...)`), which executes a `CreatePrivateUrlCommand`. The token-consuming side, `/datasets/previewUrlDatasetVersion/{token}`, resolves the token through `PrivateUrlServiceBean.getPrivateUrlUserFromToken(...)` into a `PrivateUrlUser` principal. None of that is in the API guide; it only became clear from reading the class directly.

## Adding or modifying a use case: the standard recipe

Follow this sequence:

1. **Model**: add or extend a type in `domain/models/` if the shape doesn't exist yet.
2. **Repository interface**: add the method signature to `I<Domain>Repository`.
3. **Repository implementation**: implement it in `<Domain>Repository`, calling `doGet`/`doPost`/`doPut`/`doDelete` against the real endpoint. Add a transformer function in `infra/repositories/transformers/` if the raw JSON shape differs from the domain model.
4. **Use case class**: a small class implementing `UseCase<T>` with one `execute(...)` method that delegates to the repository. Keep it thin; all real logic belongs in the repository or transformer.
5. **Wire it up** in the domain's `index.ts`: instantiate and export.
6. **Unit tests**: one test file per use case (stub the repository interface, assert delegation) plus coverage of the new repository method in `<Domain>Repository.test.ts` (mock `axios`, assert the exact URL, `params`, and `headers` sent). Both live in `test/unit/<domain>/`.
7. **Integration tests**: not optional, even when the unit tests already pass. Real assertions against a live Dataverse instance, in `test/integration/<domain>/`. See "What integration tests must cover" below for what "done" means here. Prefer exercising the SDK's own use cases for test setup and fixtures over raw `axios` test helpers when a suitable use case already exists; dogfooding catches real response-shape bugs early.
8. **Docs**: add a section to [docs/useCases.md](docs/useCases.md) matching an existing entry's format, plus a line in its table of contents.
9. **Changelog**: a line under `## [Unreleased] > ### Added` (or `Changed`/`Fixed`) in [CHANGELOG.md](CHANGELOG.md).

This recipe assumes a single request-response call. File upload doesn't fit it: it's a multi-step flow through `DirectUploadClient` (`src/files/infra/clients/`), not one repository method. Look there first if the new use case is upload-shaped rather than a plain CRUD call.

### What integration tests must cover

Unit tests only prove the SDK builds the request it intended to build; they can't catch how the real backend actually responds. Cover at least:

- **Both id formats**: numeric id and persistent identifier (`doi:...`). `buildApiEndpoint` (`ApiRepository.ts`) builds a different URL for each.
- **Authentication variations**: sufficient permission, a different real user with insufficient permission (via `createBuiltInUser`, not just a missing API key), and unauthenticated where the endpoint allows it. These are different backend code paths and fail for different reasons.
- **Every lifecycle state the endpoint touches**: `DatasetVersionState` (`DRAFT`, `RELEASED`, `ARCHIVED`, `DEACCESSIONED`) and, for files, `FileAccessStatus` (`PUBLIC`, `RESTRICTED`, `EMBARGOED`, `EMBARGOED_RESTRICTED`). A deaccessioned dataset needs `includeDeaccessioned: true` just to be found.
- **The specific error, not any error**: `.rejects.toBeInstanceOf(ReadError)` passes whether the dataset doesn't exist or a token was rejected. Assert something specific enough to rule out the wrong failure reason.

## Testing: three suites, three configs

| Command                               | Config                       | Docker?                                      |
| ------------------------------------- | ---------------------------- | -------------------------------------------- |
| `npm run test:unit`                   | `jest.config.unit.ts`        | No: `globalSetup` is deleted for this config |
| `npm run test:integration`            | `jest.config.integration.ts` | Yes, full stack                              |
| `npm run test:functional`             | `jest.config.functional.ts`  | Yes                                          |
| `npm test` / `jest -c jest.config.ts` | base config                  | Yes, runs everything including unit          |

Gotcha: running unit tests via the base config (`jest -c jest.config.ts test/unit/...`) still pays the full Docker spin-up and teardown cost, because `globalSetup` is only stripped out in `jest.config.unit.ts`. Use `npm run test:unit` (or `jest -c jest.config.unit.ts`) for fast unit-only iteration.

Integration and functional runs spin up Postgres, Solr, LocalStack, and a Dataverse container via `testcontainers` reading `test/environment/docker-compose.yml`, wait for the bootstrap container to log "Done, your instance has been configured for development. Have a nice day!", then call `setupApiKey()` (`test/environment/setup.ts`) to fetch a superuser API key into `process.env.TEST_API_KEY`. This teardown and setup cycle runs on every invocation ("Cleaning up old container volumes..."), so it's slow, and repeated back-to-back runs can strain Docker.

- Use `-t "<regex>"` (Jest's `testNamePattern`) to run a subset fast. Jest skips `beforeAll`/`beforeEach` hooks for `describe` blocks with zero matching tests, so a filtered run of a handful of tests finishes in a few seconds instead of minutes. Hooks on any ancestor of a matching test still run, though.
- `test/environment/docker-compose.yml`'s published port (Dataverse on `8080`) and `test/testHelpers/TestConstants.ts`'s `TEST_API_URL` have to agree. If they drift, `setupApiKey()` fails to connect and the whole suite dies with an axios `AggregateError` right after "Test containers up and running," easy to misdiagnose as a code bug when it's really a config-pair mismatch. If a non-default port is needed locally, for example because another Dataverse dev environment on the same machine already holds 8080, change both files together, and revert both together too: plain `8080:8080` is what CI expects, since CI runners don't have a competing local Dataverse instance.

## Preventing flaky tests and race conditions

- **Reuse running containers for iterative work instead of recreating them.** `setupContainers()` (`test/environment/setup.ts`) skips setup entirely when `SKIP_CONTAINERS=true`, and the `:no-teardown` npm scripts set `TESTCONTAINERS_RYUK_DISABLED=true` so containers survive after Jest exits. Start once with `npm run test:integration:no-teardown`, then iterate with `SKIP_CONTAINERS=true npm run test:integration`. Recreating the full stack on every run is itself a source of flakiness: repeated teardown and startup cycles compete for the same host ports and can time out the bootstrap wait strategy under load.
- **Don't shrink a retry budget below its default without a documented reason.** `waitForNoLocks` (`test/testHelpers/datasets/datasetHelper.ts`) defaults to 20 retries at 1 second each; a test passing a shorter override saves a few seconds on a passing run but leaves far less margin on a slow or loaded machine, and the failure mode is a timeout that reproduces inconsistently rather than a clear error.
- **Give lifecycle tests (create, publish, delete) their own dataset** rather than reusing one a sibling `describe` already set up for something else. Deleting a resource in one test must never be able to break an unrelated test elsewhere in the file just because it happened to run later against the same fixture.
- **Assign derived values inside `beforeEach`, not at `describe`-body scope.** A `const` read directly in a `describe(...)` callback resolves before any `beforeAll` runs, so it captures a stale or `undefined` value from an outer `let` an ancestor hook sets later (see the Jest pitfalls below). This is a race dressed up as a typo: it produces a consistently wrong value rather than a visibly broken test, which makes it easy to miss in review.
- **Reset shared ambient state explicitly.** Wrap any test that changes `ApiConfig` (or similar global state) in its own `beforeEach`/`afterEach` reset rather than leaving the reset implicit or assuming test order. Inserting one new test between two others is enough to expose an implicit dependency on leftover state.

## Jest pitfalls worth knowing up front

- **Describe-registration-time capture**: a bare `const x = someOuterLetVariable` written directly in a `describe(...)` callback body runs at registration time, before any `beforeAll` has executed, so it captures whatever the outer variable holds at that instant, often `undefined`, not its value at test-run time. To use the current value of something an ancestor `beforeAll` sets, assign it inside a `beforeEach`/`beforeAll`, not as a describe-body `const`.
- **`toHaveBeenCalledWith` and trailing `undefined`**: adding a new trailing optional parameter to a method changes the argument count callers pass, even when the new argument is `undefined`. Existing exact-match assertions (`toHaveBeenCalledWith(a, b, c)`) fail against a call that now includes a fourth `undefined` argument; jest's mock-call equality isn't forgiving about trailing `undefined` items the way `toEqual` is for object properties. Update every existing assertion to include the new trailing argument explicitly.

## Git hygiene

The `.husky/pre-commit` hook runs `npm run format && npm run typecheck && npm run lint:fix && git add .`. That final `git add .` stages every modified or untracked file in the working tree, not just what got `git add`ed deliberately. Unrelated in-progress edits sitting in the working tree at commit time get swept in regardless of intent. Set aside anything that shouldn't be bundled before committing, for example with `git stash push -- <path>`, or by copying it elsewhere and restoring it after.

## Creating a pull request

1. **Branch from `develop`**, the default branch, not `main`. Name the branch after the issue it addresses, `<issue-number>-<short-description>`, matching the convention already in use (`149-configbaker`, `168-get-all-metadatablocks`).
2. **Work through the [CONTRIBUTING.md](CONTRIBUTING.md) checklist** before opening the PR: the project builds, `npm run lint` and `npm run format` pass, unit and integration tests pass, new tests cover the new functionality, [docs/useCases.md](docs/useCases.md) has an entry for any use case added or modified, and [CHANGELOG.md](CHANGELOG.md) has a line under `[Unreleased]`.
3. **Push the branch and open the PR against `develop`**:
   ```
   gh pr create --base develop --title "<title>"
   ```
4. **Fill in every section of the PR template** ([.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)): what the PR does and why, which issue it closes, any related `IQSS/dataverse` backend PR it depends on, notes for the reviewer, how to test it, and whether a changelog entry is included.
5. **Link the backend PR** in the "Related Dataverse PRs" field when this SDK change depends on one, the same PR the "Finding the API spec" section above points to when an endpoint isn't documented yet.
6. **Match the existing commit-message convention**: recent history uses a `type: description` prefix (`feat: ...`, `fix: ...`, `chore(deps): ...`), even though it isn't formally enforced.

`deploy_pr.yml` runs three CI jobs on every PR: `test-unit`, `test-integration`, and `test-functional` (the last only after integration passes). This is the actual enforcement behind step 7 of the use-case recipe: skipping integration tests locally still means CI runs them before merge.

## Where the rest of the documentation lives

- [README.md](README.md): one-line pitch, install, minimal usage example
- [docs/useCases.md](docs/useCases.md): the exhaustive per-use-case reference, linked from every use case's JSDoc
- [CHANGELOG.md](CHANGELOG.md): Keep a Changelog format, `[Unreleased]` section at the top
- [CONTRIBUTING.md](CONTRIBUTING.md): PR checklist covering build, lint and format, unit and integration tests for new functionality, docs/useCases.md updates, and changelog updates
- [docs/localDevelopment.md](docs/localDevelopment.md): local dev environment setup
- [docs/making-releases.md](docs/making-releases.md): the release process, versioning, and publishing to npm
