# Use Cases

In the context of [Domain-Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html), a use case is a specific way to describe and capture a user's or system's interaction with the domain to achieve a particular goal.

This package exposes the functionality in the form of use cases, with the main goal that any package consumer can easily identify the desired functionality.

The different use cases currently available in the package are classified below, according to the subdomains they target:

## Table of Contents

- [Datasets](#Datasets)
  - [Datasets read use cases](#datasets-read-use-cases)
    - [Get a Dataset](#get-a-dataset)
    - [Get Dataset By Private URL Token](#get-dataset-by-private-url-token)
    - [Get Dataset Citation Text](#get-dataset-citation-text)
    - [Get Dataset Citation Text By Private URL Token](#get-dataset-citation-text-by-private-url-token)
    - [Get Dataset Locks](#get-dataset-locks)
    - [Get Dataset Summary Field Names](#get-dataset-summary-field-names)
    - [Get User Permissions on a Dataset](#get-user-permissions-on-a-dataset)
    - [List All Datasets](#list-all-datasets)
- [Files](#Files)
  - [Files read use cases](#files-read-use-cases)
    - [List Files in a Dataset](#list-files-in-a-dataset)
- [Metadata Blocks](#metadata-blocks)
- [Users](#Users)
- [Info](#Info)

## Datasets

### Datasets Read Use Cases

#### Get a Dataset

Returns a [Dataset](../src/datasets/domain/models/Dataset.ts) instance, given the search parameters to identify it.

##### Example call:

```typescript
import { getAllDatasetPreviews } from '@iqss/dataverse-client-javascript';

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA';
const datasetVersionId = '1.0';

getDataset.execute(datasetId, datasetVersionId).then((dataset: Dataset) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDataset.ts)_ definition.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.

There is a third optional parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.

#### Get Dataset By Private URL Token

Returns a [Dataset](../src/datasets/domain/models/Dataset.ts) instance, given an associated Private URL Token.

```typescript
import { getPrivateUrlDataset } from '@iqss/dataverse-client-javascript';

/* ... */

const token = 'a56444bc-7697-4711-8964-e0577f055fd2';

getPrivateUrlDataset.execute(token).then((dataset: Dataset) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetPrivateUrlDataset.ts)_ definition.

#### Get Dataset Citation Text

Returns the Dataset citation text.

##### Example call:

```typescript
import { getDatasetCitation } from '@iqss/dataverse-client-javascript';

/* ... */

const datasetId = 2;
const datasetVersionId = '1.0';

getDatasetCitation.execute(datasetId, datasetVersionId).then((citationText: string) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetCitation.ts) definition_.

There is a third optional parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.

#### Get Dataset Citation Text By Private URL Token

Returns the Dataset citation text, given an associated Private URL Token.

##### Example call:

```typescript
import { getPrivateUrlDatasetCitation } from '@iqss/dataverse-client-javascript';

/* ... */

const token = 'a56444bc-7697-4711-8964-e0577f055fd2';

getPrivateUrlDatasetCitation.execute(token).then((citationText: string) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetPrivateUrlDatasetCitation.ts) definition_.

#### Get Dataset Locks

Returns a [DatasetLock](../src/datasets/domain/models/DatasetLock.ts) array of all locks present in a Dataset.

##### Example call:

```typescript
import { getDatasetLocks } from '@iqss/dataverse-client-javascript';

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA';

getDatasetLocks.execute(datasetId).then((datasetLocks: DatasetLock[]) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetLocks.ts) definition_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Get Dataset Summary Field Names

Returns the names of the dataset summary fields configured in the installation.

##### Example call:

```typescript
import { getDatasetSummaryFieldNames } from '@iqss/dataverse-client-javascript';

/* ... */

getDatasetSummaryFieldNames.execute().then((names: string[]) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetSummaryFieldNames.ts) definition_.

#### Get User Permissions on a Dataset

Returns an instance of [DatasetUserPermissions](../src/datasets/domain/models/DatasetUserPermissions.ts) that includes the permissions that the calling user has on a particular Dataset.

##### Example call:

```typescript
import { getDatasetUserPermissions } from '@iqss/dataverse-client-javascript';

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA';

getDatasetUserPermissions.execute(datasetId).then((permissions: DatasetUserPermissions) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetUserPermissions.ts) definition_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### List All Datasets

Returns an instance of [DatasetPreviewSubset](../src/datasets/domain/models/DatasetPreviewSubset.ts) that contains reduced information for each dataset that the calling user can access in the installation.

##### Example call:

```typescript
import { getAllDatasetPreviews } from '@iqss/dataverse-client-javascript';

/* ... */

const limit = 10;
const offset = 20;

getAllDatasetPreviews.execute(limit, offset).then((subset: DatasetPreviewSubset) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetAllDatasetPreviews.ts) definition_.

Note that `limit` and `offset` are optional parameters for pagination.

The `DatasetPreviewSubset`returned instance contains a property called `totalDatasetCount` which is necessary for pagination.

## Files

### Files read use cases

#### List Files in a Dataset

Returns an instance of [FilesSubset](../src/files/domain/models/FilesSubset.ts), which contains the files from the requested Dataset and page (if pagination parameters are set).

##### Example call:

```typescript
import { getDatasetFiles } from '@iqss/dataverse-client-javascript';

/* ... */

const datasetId = 2;
const datasetVersionId = '1.0';

getDatasetFiles.execute(datasetId, datasetVersionId).then((subset: FilesSubset) => {
  /* ... */
});

/* ... */
```

_See [use case](../src/files/domain/useCases/GetDatasetFiles.ts) definition_.

This use case supports the following optional parameters depending on the search goals:

- **includeDeaccessioned**: (boolean) Indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.
- **limit**: (number) Limit for pagination.
- **offset**: (number) Offset for pagination.
- **fileSearchCriteria**: ([FileSearchCriteria](../src/files/domain/models/FileCriteria.ts)) Supports filtering the files by different file properties.
- **fileOrderCriteria**: ([FileOrderCriteria](../src/files/domain/models/FileCriteria.ts)) Supports ordering the results according to different criteria. If not set, the defalt value is `FileOrderCriteria.NAME_AZ`.

##### Example call using optional parameters:

```typescript
import { getDatasetFiles } from '@iqss/dataverse-client-javascript';

/* ... */

const datasetId: number = 2;
const datasetVersionId: string = '1.0';
const includeDeaccessioned: boolean = true;
const limit: number = 10;
const offset: number = 20;
const searchCriteria: FileSearchCriteria = {
  searchText: 'file title',
};
const orderCriteria: FileOrderCriteria = FileOrderCriteria.NEWEST;

getDatasetFiles
  .execute(datasetId, datasetVersionId, includeDeaccessioned, limit, offset, searchCriteria, orderCriteria)
  .then((subset: FilesSubset) => {
    /* ... */
  });

/* ... */
```

## Metadata Blocks

TODO

## Users

TODO

## Info

TODO
