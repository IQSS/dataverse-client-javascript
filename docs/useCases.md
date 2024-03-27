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
  - [Datasets write use cases](#datasets-write-use-cases)
    - [Create a Dataset](#create-a-dataset)
    - [Publish a Dataset](#publish-a-dataset)
- [Files](#Files)
  - [Files read use cases](#files-read-use-cases)
    - [Get a File](#get-a-file)
    - [Get a File and its Dataset](#get-a-file-and-its-dataset)
    - [Get File Citation Text](#get-file-citation-text)
    - [Get File Counts in a Dataset](#get-file-counts-in-a-dataset)
    - [Get File Data Tables](#get-file-data-tables)
    - [Get File Download Count](#get-file-download-count)
    - [Get the size of Downloading all the files of a Dataset Version](#get-the-size-of-downloading-all-the-files-of-a-dataset-version)
    - [Get User Permissions on a File](#get-user-permissions-on-a-file)
    - [List Files in a Dataset](#list-files-in-a-dataset)
- [Metadata Blocks](#metadata-blocks)
  - [Metadata Blocks read use cases](#metadata-blocks-read-use-cases)
    - [Get Metadata Block By Name](#get-metadata-block-by-name)
- [Users](#Users)
  - [Users read use cases](#users-read-use-cases)
    - [Get Current Authenticated User](#get-current-authenticated-user)
- [Info](#Info)
  - [Get Dataverse Backend Version](#get-dataverse-backend-version)
  - [Get Maximum Embargo Duration In Months](#get-maximum-embargo-duration-in-months)
  - [Get ZIP Download Limit](#get-zip-download-limit)

## Datasets

### Datasets Read Use Cases

#### Get a Dataset

Returns a [Dataset](../src/datasets/domain/models/Dataset.ts) instance, given the search parameters to identify it.

##### Example call:

```typescript
import { getDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'
const datasetVersionId = '1.0'

getDataset.execute(datasetId, datasetVersionId).then((dataset: Dataset) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDataset.ts)_ definition.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.

There is an optional third parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.

#### Get Dataset By Private URL Token

Returns a [Dataset](../src/datasets/domain/models/Dataset.ts) instance, given an associated Private URL Token.

```typescript
import { getPrivateUrlDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const token = 'a56444bc-7697-4711-8964-e0577f055fd2'

getPrivateUrlDataset.execute(token).then((dataset: Dataset) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetPrivateUrlDataset.ts)_ definition.

#### Get Dataset Citation Text

Returns the Dataset citation text.

##### Example call:

```typescript
import { getDatasetCitation } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 2
const datasetVersionId = '1.0'

getDatasetCitation.execute(datasetId, datasetVersionId).then((citationText: string) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetCitation.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

There is an optional third parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.

#### Get Dataset Citation Text By Private URL Token

Returns the Dataset citation text, given an associated Private URL Token.

##### Example call:

```typescript
import { getPrivateUrlDatasetCitation } from '@iqss/dataverse-client-javascript'

/* ... */

const token = 'a56444bc-7697-4711-8964-e0577f055fd2'

getPrivateUrlDatasetCitation.execute(token).then((citationText: string) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetPrivateUrlDatasetCitation.ts) implementation_.

#### Get Dataset Locks

Returns a [DatasetLock](../src/datasets/domain/models/DatasetLock.ts) array of all locks present in a Dataset.

##### Example call:

```typescript
import { getDatasetLocks } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'

getDatasetLocks.execute(datasetId).then((datasetLocks: DatasetLock[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetLocks.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Get Dataset Summary Field Names

Returns the names of the dataset summary fields configured in the installation.

##### Example call:

```typescript
import { getDatasetSummaryFieldNames } from '@iqss/dataverse-client-javascript'

/* ... */

getDatasetSummaryFieldNames.execute().then((names: string[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetSummaryFieldNames.ts) implementation_.

#### Get User Permissions on a Dataset

Returns an instance of [DatasetUserPermissions](../src/datasets/domain/models/DatasetUserPermissions.ts) that includes the permissions that the calling user has on a particular Dataset.

##### Example call:

```typescript
import { getDatasetUserPermissions } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'

getDatasetUserPermissions.execute(datasetId).then((permissions: DatasetUserPermissions) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetUserPermissions.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### List All Datasets

Returns an instance of [DatasetPreviewSubset](../src/datasets/domain/models/DatasetPreviewSubset.ts) that contains reduced information for each dataset that the calling user can access in the installation.

##### Example call:

```typescript
import { getAllDatasetPreviews } from '@iqss/dataverse-client-javascript'

/* ... */

const limit = 10
const offset = 20
const collectionId = 'subcollection1'

getAllDatasetPreviews.execute(limit, offset, collectionId).then((subset: DatasetPreviewSubset) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetAllDatasetPreviews.ts) implementation_.

Note that `limit` and `offset` are optional parameters for pagination.

Note that `collectionId` is an optional parameter to filter datasets by collection. If not set, the default value is `root`.

The `DatasetPreviewSubset`returned instance contains a property called `totalDatasetCount` which is necessary for pagination.

### Datasets Write Use Cases

#### Create a Dataset

Creates a new Dataset in a collection, given a [NewDatasetDTO](../src/datasets/domain/dtos/NewDatasetDTO.ts) object and an optional collection identifier, which defaults to `root`.

This use case validates the submitted fields of each metadata block and can return errors of type [ResourceValidationError](../src/core/domain/useCases/validators/errors/ResourceValidationError.ts), which include sufficient information to determine which field value is invalid and why.

##### Example call:

```typescript
import { createDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const newDatasetDTO: NewDatasetDTO = {
  metadataBlockValues: [
    {
      name: 'citation',
      fields: {
        title: 'New Dataset',
        author: [
          {
            authorName: 'John Doe',
            authorAffiliation: 'Dataverse'
          },
          {
            authorName: 'John Lee',
            authorAffiliation: 'Dataverse'
          }
        ],
        datasetContact: [
          {
            datasetContactEmail: 'johndoe@dataverse.com',
            datasetContactName: 'John'
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: 'This is the description of our new dataset'
          }
        ],
        subject: 'Earth and Environmental Sciences'

        /* Rest of field values... */
      }
    }
  ]
}

createDataset.execute(newDatasetDTO).then((newDatasetIds: CreatedDatasetIdentifiers) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/CreateDataset.ts) implementation_.

The above example creates the new dataset in the `root` collection since no collection identifier is specified. If you want to create the dataset in a different collection, you must add the collection identifier as a second parameter in the use case call.

The use case returns a [CreatedDatasetIdentifiers](../src/datasets/domain/models/CreatedDatasetIdentifiers.ts) object, which includes the persistent and numeric identifiers of the created dataset.

#### Publish a Dataset

Publishes a Dataset, given its identifier and the type of version update to perform.

##### Example call:

```typescript
import { publishDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'
const versionUpdateType = VersionUpdateType.MINOR

publishDataset.execute(datasetId, versionUpdateType).then((publishedDataset: Dataset) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/PublishDataset.ts) implementation_.

The above example publishes the dataset with the specified identifier and performs a minor version update. If the response
is successful, the use case does not return the dataset object, but the HTTP status code `200`. Otherwise, it throws an error.
If you want to perform a major version update, you must set the `versionUpdateType` parameter to `VersionUpdateType.MAJOR`.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `versionUpdateType` parameter can be a [VersionUpdateType](../src/datasets/domain/models/VersionUpdateType.ts) enum value, which can be one of the following:

- `VersionUpdateType.MINOR`
- `VersionUpdateType.MAJOR`

## Files

### Files read use cases

#### Get a File

Returns a [File](../src/files/domain/models/File.ts) instance, given the search parameters to identify it.

##### Example call:

```typescript
import { getFile } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 2
const datasetVersionId = '1.0'

getFile.execute(fileId, datasetVersionId).then((file: File) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFile.ts)_ definition.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.

#### Get a File and its Dataset

Returns a tuple of [File](../src/files/domain/models/File.ts) and [Dataset](../src/datasets/domain/models/Dataset.ts) objects (`[File, Dataset]`), given the search parameters to identify the file.

The returned dataset object corresponds to the dataset version associated with the requested file.

##### Example call:

```typescript
import { getFileAndDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 2
const datasetVersionId = '1.0'

getFileAndDataset.execute(fileId, datasetVersionId).then((fileAndDataset: [File, Dataset]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileAndDataset.ts)_ definition.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.

#### Get File Citation Text

Returns the File citation text.

##### Example call:

```typescript
import { getFileCitation } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 3
const datasetVersionId = '1.0'

getFileCitation.execute(fileId, datasetVersionId).then((citationText: string) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileCitation.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

There is an optional third parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the file search. If not set, the default value is `false`.

#### Get File Counts in a Dataset

Returns an instance of [FileCounts](../src/files/domain/models/FileCounts.ts), containing the requested Dataset total file count, as well as file counts for the following file properties:

- **Per content type**
- **Per category name**
- **Per tabular tag name**
- **Per access status** (Possible values: _Public_, _Restricted_, _EmbargoedThenRestricted_, _EmbargoedThenPublic_)

##### Example call:

```typescript
import { getDatasetFileCounts } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 2
const datasetVersionId = '1.0'

getDatasetFileCounts.execute(datasetId, datasetVersionId).then((fileCounts: FileCounts) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetDatasetFileCounts.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.
The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.
There is an optional third parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.

An optional fourth parameter `fileSearchCriteria` receives a [FileSearchCriteria](../src/files/domain/models/FileCriteria.ts) object to retrieve counts only for files that match the specified criteria.

##### Example call using optional parameters:

```typescript
import { getDatasetFileCounts } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId: number = 2
const datasetVersionId: string = '1.0'
const includeDeaccessioned: boolean = true
const searchCriteria: FileSearchCriteria = {
  categoryName: 'physics'
}

getDatasetFileCounts
  .execute(datasetId, datasetVersionId, includeDeaccessioned, searchCriteria)
  .then((fileCounts: FileCounts) => {
    /* ... */
  })

/* ... */
```

#### Get File Data Tables

This use case is oriented toward tabular files and provides an array of [FileDataTable](../src/files/domain/models/FileDataTable.ts) objects for an existing tabular file.

##### Example call:

```typescript
import { getFileDataTables } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 2

getFileDataTables.execute(fileId).then((dataTables: FileDataTable[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileDataTables.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Get File Download Count

Provides the download count for a particular File.

##### Example call:

```typescript
import { getFileDownloadCount } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId: number = 2

getFileDownloadCount.execute(fileId).then((count: number) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileDownloadCount.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Get the size of Downloading all the files of a Dataset Version

Returns the combined size in bytes of all the files available for download from a particular Dataset.

##### Example call:

```typescript
import { getDatasetFilesTotalDownloadSize } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId: number = 2
const datasetVersionId: string = '1.0'

getDatasetFilesTotalDownloadSize.execute(datasetId, datasetVersionId).then((size: number) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetDatasetFilesTotalDownloadSize.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.
The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.
There is a third optional parameter called `fileDownloadSizeMode` which receives an enum type of [FileDownloadSizeMode](../src/files/domain/models/FileDownloadSizeMode.ts), and applies a filter criteria to the operation. This parameter supports the following values:

- `FileDownloadSizeMode.ALL` (Default): Includes both archival and original sizes for tabular files
- `FileDownloadSizeMode.ARCHIVAL`: Includes only the archival size for tabular files
- `FileDownloadSizeMode.ORIGINAL`: Includes only the original size for tabular files

An optional fourth parameter called `fileSearchCriteria` receives a [FileSearchCriteria](../src/files/domain/models/FileCriteria.ts) object to only consider files that match the specified criteria.

An optional fifth parameter called `includeDeaccessioned` indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.

##### Example call using optional parameters:

```typescript
import { getDatasetFilesTotalDownloadSize } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId: number = 2
const datasetVersionId: string = '1.0'
const mode: FileDownloadSizeMode = FileDownloadSizeMode.ARCHIVAL
const searchCriteria: FileDownloadSizeMode = {
  categoryName: 'physics'
}
const includeDeaccessioned: boolean = true

getDatasetFilesTotalDownloadSize
  .execute(datasetId, datasetVersionId, mode, searchCriteria, includeDeaccessioned)
  .then((size: number) => {
    /* ... */
  })

/* ... */
```

#### Get User Permissions on a File

This use case returns a [FileUserPermissions](../src/files/domain/models/FileUserPermissions.ts) object, which includes the permissions that the calling user has on a particular File.

The returned _FileUserPermissions_ object contains the following permissions, as booleans:

- Can download the file (_canDownloadFile_)
- Can manage the file permissions (_canManageFilePermissions_)
- Can edit the file owner dataset (_canEditOwnerDataset_)

##### Example call:

```typescript
import { getFileUserPermissions } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId: number = 2

getFileUserPermissions.execute(fileId).then((permissions: FileUserPermissions) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileUserPermissions.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### List Files in a Dataset

Returns an instance of [FilesSubset](../src/files/domain/models/FilesSubset.ts), which contains the files from the requested Dataset and page (if pagination parameters are set).

##### Example call:

```typescript
import { getDatasetFiles } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 2
const datasetVersionId = '1.0'

getDatasetFiles.execute(datasetId, datasetVersionId).then((subset: FilesSubset) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetDatasetFiles.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.
The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.
This use case supports the following optional parameters depending on the search goals:

- **includeDeaccessioned**: (boolean) Indicates whether to consider deaccessioned versions or not in the dataset search. If not set, the default value is `false`.
- **limit**: (number) Limit for pagination.
- **offset**: (number) Offset for pagination.
- **fileSearchCriteria**: ([FileSearchCriteria](../src/files/domain/models/FileCriteria.ts)) Supports filtering the files by different file properties.
- **fileOrderCriteria**: ([FileOrderCriteria](../src/files/domain/models/FileCriteria.ts)) Supports ordering the results according to different criteria. If not set, the defalt value is `FileOrderCriteria.NAME_AZ`.

##### Example call using optional parameters:

```typescript
import { getDatasetFiles } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId: number = 2
const datasetVersionId: string = '1.0'
const includeDeaccessioned: boolean = true
const limit: number = 10
const offset: number = 20
const searchCriteria: FileSearchCriteria = {
  searchText: 'file title'
}
const orderCriteria: FileOrderCriteria = FileOrderCriteria.NEWEST

getDatasetFiles
  .execute(
    datasetId,
    datasetVersionId,
    includeDeaccessioned,
    limit,
    offset,
    searchCriteria,
    orderCriteria
  )
  .then((subset: FilesSubset) => {
    /* ... */
  })

/* ... */
```

## Metadata Blocks

### Metadata Blocks read use cases

#### Get Metadata Block By Name

Returns a [MetadataBlock](../src/metadataBlocks/domain/models/MetadataBlock.ts) instance, given its name.

##### Example call:

```typescript
import { getMetadataBlockByName } from '@iqss/dataverse-client-javascript'

/* ... */

const name = 'citation'

getMetadataBlockByName.execute(name).then((metadataBlock: MetadataBlock) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/metadataBlocks/domain/useCases/GetMetadataBlockByName.ts) implementation_.

## Users

### Users read use cases

#### Get Current Authenticated User

Returns the current [AuthenticatedUser](../src/users/domain/models/AuthenticatedUser.ts) corresponding to the authentication mechanism provided through `ApiConfig`.

##### Example call:

```typescript
import { getCurrentAuthenticatedUser } from '@iqss/dataverse-client-javascript'

/* ... */

getCurrentAuthenticatedUser.execute().then((user: AuthenticatedUser) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/users/domain/useCases/GetCurrentAuthenticatedUser.ts) implementation_.

## Info

#### Get Dataverse Backend Version

Returns a [DataverseVersion](../src/info/domain/models/DataverseVersion.ts) object, which contains version information for the Dataverse backend installation.

##### Example call:

```typescript
import { getDataverseVersion } from '@iqss/dataverse-client-javascript'

/* ... */

getDataverseVersion.execute().then((version: DataverseVersion) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/info/domain/useCases/GetDataverseVersion.ts) implementation_.

#### Get Maximum Embargo Duration In Months

Returns a number indicating the configured maximum embargo duration in months. For information on the possible values
that can be returned, please refer to the `MaxEmbargoDurationInMonths` property in the Dataverse documentation:
[MaxEmbargoDurationInMonths](https://guides.dataverse.org/en/latest/installation/config.html#maxembargodurationinmonths).

##### Example call:

```typescript
import { getMaxEmbargoDurationInMonths } from '@iqss/dataverse-client-javascript'

/* ... */

getMaxEmbargoDurationInMonths.execute().then((months: number) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/info/domain/useCases/GetMaxEmbargoDurationInMonths.ts) implementation_.

#### Get ZIP Download Limit

Returns a number indicating the configured ZIP download limit in bytes.

##### Example call:

```typescript
import { getZipDownloadLimit } from '@iqss/dataverse-client-javascript'

/* ... */

getZipDownloadLimit.execute().then((downloadLimit: number) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/info/domain/useCases/GetZipDownloadLimit.ts) implementation_.
