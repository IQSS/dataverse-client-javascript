# Use Cases

In the context of [Domain-Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html), a use case is a specific way to describe and capture a user's or system's interaction with the domain to achieve a particular goal.

This package exposes the functionality in the form of use cases, with the main goal that any package consumer can easily identify the desired functionality.

The different use cases currently available in the package are classified below, according to the subdomains they target:

## Table of Contents

- [Collections](#Collections)
  - [Collections read use cases](#collections-read-use-cases)
    - [Get a Collection](#get-a-collection)
    - [Get Collection Facets](#get-collection-facets)
    - [Get User Permissions on a Collection](#get-user-permissions-on-a-collection)
    - [List All Collection Items](#list-all-collection-items)
    - [List My Data Collection Items](#list-my-data-collection-items)
    - [Get Collection Featured Items](#get-collection-featured-items)
  - [Collections write use cases](#collections-write-use-cases)
    - [Create a Collection](#create-a-collection)
    - [Update a Collection](#update-a-collection)
    - [Publish a Collection](#publish-a-collection)
    - [Delete a Collection](#delete-a-collection)
    - [Update Collection Featured Items](#update-collection-featured-items)
    - [Delete Collection Featured Items](#delete-collection-featured-items)
    - [Delete a Collection Featured Item](#delete-a-collection-featured-item)
- [Datasets](#Datasets)
  - [Datasets read use cases](#datasets-read-use-cases)
    - [Get a Dataset](#get-a-dataset)
    - [Get Dataset By Private URL Token](#get-dataset-by-private-url-token)
    - [Get Dataset Citation Text](#get-dataset-citation-text)
    - [Get Dataset Citation Text By Private URL Token](#get-dataset-citation-text-by-private-url-token)
    - [Get Dataset Locks](#get-dataset-locks)
    - [Get Dataset Summary Field Names](#get-dataset-summary-field-names)
    - [Get User Permissions on a Dataset](#get-user-permissions-on-a-dataset)
    - [Get Differences between Two Dataset Versions](#get-differences-between-two-dataset-versions)
    - [List All Datasets](#list-all-datasets)
    - [Get Dataset Versions Summaries](#get-dataset-versions-summaries)
  - [Datasets write use cases](#datasets-write-use-cases)
    - [Create a Dataset](#create-a-dataset)
    - [Update a Dataset](#update-a-dataset)
    - [Publish a Dataset](#publish-a-dataset)
    - [Deaccession a Dataset](#deaccession-a-dataset)
    - [Delete a Draft Dataset](#delete-a-draft-dataset)
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
    - [Is File Deleted](#is-file-deleted)
    - [Get File Version Summaries](#get-file-version-summaries)
  - [Files write use cases](#files-write-use-cases)
    - [File Uploading Use Cases](#file-uploading-use-cases)
    - [Delete a File](#delete-a-file)
    - [Replace a File](#replace-a-file)
    - [Restrict or Unrestrict a File](#restrict-or-unrestrict-a-file)
    - [Update File Metadata](#update-file-metadata)
- [Metadata Blocks](#metadata-blocks)
  - [Metadata Blocks read use cases](#metadata-blocks-read-use-cases)
    - [Get All Facetable Metadata Fields](#get-all-facetable-metadata-fields)
    - [Get All Metadata Blocks](#get-all-metadata-blocks)
    - [Get Metadata Block By Name](#get-metadata-block-by-name)
    - [Get Collection Metadata Blocks](#get-collection-metadata-blocks)
- [Users](#Users)
  - [Users read use cases](#users-read-use-cases)
    - [Get Current Authenticated User](#get-current-authenticated-user)
    - [Get Current API Token](#get-current-api-token)
  - [Users write use cases](#users-write-use-cases)
    - [Delete Current API Token](#delete-current-api-token)
    - [Recreate Current API Token](#recreate-current-api-token)
    - [Register User](#register-user)
- [Roles](#Roles)
  - [Roles read use cases](#roles-read-use-cases)
    - [Get User Selectable Roles](#get-user-selectable-roles)
- [Info](#Info)
  - [Get Dataverse Backend Version](#get-dataverse-backend-version)
  - [Get Maximum Embargo Duration In Months](#get-maximum-embargo-duration-in-months)
  - [Get ZIP Download Limit](#get-zip-download-limit)
  - [Get Application Terms of Use](#get-application-terms-of-use)
- [Contact](#Contact)
  - [Send Feedback to Object Contacts](#send-feedback-to-object-contacts)

## Collections

### Collections Read Use Cases

#### Get a Collection

Returns a [Collection](../src/collections/domain/models/Collection.ts) instance, given the search parameters to identify it.

##### Example call:

```typescript
import { getCollection } from '@iqss/dataverse-client-javascript'

/* ... */
// Case 1: Fetch Collection by its numerical ID
const collectionIdOrAlias = 12345

getCollection
  .execute(collectionId)
  .then((collection: Collection) => {
    /* ... */
  })
  .catch((error: Error) => {
    /* ... */
  })

/* ... */

// Case 2: Fetch Collection by its alias
const collectionIdOrAlias = 'classicLiterature'
getCollection
  .execute(collectionAlias)
  .then((collection: Collection) => {
    /* ... */
  })
  .catch((error: Error) => {
    /* ... */
  })

/* ... */
```

_See [use case](../src/collections/domain/useCases/GetCollection.ts)_ definition.

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

If no collection identifier is specified, the default collection identifier; `:root` will be used. If you want to search for a different collection, you must add the collection identifier as a parameter in the use case call.

#### Get Collection Facets

Returns a [CollectionFacet](../src/collections/domain/models/CollectionFacet.ts) array containing the facets of the requested collection, given the collection identifier or alias.

##### Example call:

```typescript
import { getCollectionFacets } from '@iqss/dataverse-client-javascript'

const collectionIdOrAlias = 12345

getCollectionFacets
  .execute(collectionId)
  .then((facets: CollectionFacet[]) => {
    /* ... */
  })
  .catch((error: Error) => {
    /* ... */
  })
```

_See [use case](../src/collections/domain/useCases/GetCollectionFacets.ts)_ definition.

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

If no collection identifier is specified, the default collection identifier; `:root` will be used. If you want to search for a different collection, you must add the collection identifier as a parameter in the use case call.

#### Get User Permissions on a Collection

Returns an instance of [CollectionUserPermissions](../src/collections/domain/models/CollectionUserPermissions.ts) that includes the permissions that the calling user has on a particular Collection.

##### Example call:

```typescript
import { getCollectionUserPermissions } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 12345

getCollectionUserPermissions
  .execute(collectionIdOrAlias)
  .then((permissions: CollectionUserPermissions) => {
    /* ... */
  })

/* ... */
```

_See [use case](../src/collections/domain/useCases/GetCollectionUserPermissions.ts) implementation_.

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

If no collection identifier is specified, the default collection identifier; `:root` will be used. If you want to search for a different collection, you must add the collection identifier as a parameter in the use case call.

#### List All Collection Items

Returns an instance of [CollectionItemSubset](../src/collections/domain/models/CollectionItemSubset.ts) that contains reduced information for each collection item that the calling user can access in the installation.

##### Example call:

```typescript
import { getCollectionItems } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionId = 'subcollection1'
const limit = 10
const offset = 20

getCollectionItems.execute(collectionId, limit, offset).then((subset: CollectionItemSubset) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/collections/domain/useCases/GetCollectionItems.ts) implementation_.

Note that `collectionId` is an optional parameter to filter the items by a specific collection. If not set, the use case will return items starting from the root collection.

The `CollectionItemSubset`returned instance contains a property called `totalItemCount` which is necessary for pagination.

This use case supports the following optional parameters depending on the search goals:

- **limit**: (number) Limit for pagination.
- **offset**: (number) Offset for pagination.
- **collectionSearchCriteria**: ([CollectionSearchCriteria](../src/collections/domain/models/CollectionSearchCriteria.ts)) Supports filtering the collection items by different properties.

#### List My Data Collection Items

Returns an instance of [CollectionItemSubset](../src/collections/domain/models/CollectionItemSubset.ts) that contains reduced information for each collection item for which the calling user has a role.

##### Example call:

```typescript
import { getMyDataCollectionItems } from '@iqss/dataverse-client-javascript'

/* ... */

const roleIds = [1, 2]
const collectionItemTypes = [CollectionItemType.DATASET, CollectionItemType.FILE]
const publishingStatuses = [
  PublicationStatus.Published,
  PublicationStatus.Draft,
  PublicationStatus.Unpublished
]
const limit = 10
const selectedPage = 1
const searchText = 'search text'
const otherUserName = 'otherUserName'

getMyDataCollectionItems
  .execute(
    roleIds,
    collectionItemTypes,
    publishingStatuses,
    limit,
    selectedPage,
    searchText,
    otherUserName
  )
  .then((subset: CollectionItemSubset) => {
    /* ... */
  })

/* ... */
```

_See [use case](../src/collections/domain/useCases/GetMyDataCollectionItems.ts) implementation_.
This use case requires the following parameters:

- **roleIds** is an array of user role identifiers to filter the results. At least one roleId must be specified.
- **collectionItemTypes** is an array of collection item types to filter the results. At least one collectionItemType must be specified.
- **publishingStatuses** is an array of publishing statuses to filter the results. At least one publishingStatus must be specified.

This use case supports the following optional parameters depending on the search goals:

- **limit**: (number) Limit of items per page for pagination. (default is 10)
- **selectedPage**: (number) the page of results to be returned. (default is 1)
- **searchText** is an optional string to filter the results by.
- **otherUserName** is an optional string to return the collection items of another user. If not set, the calling user will be used. _Only superusers can use this parameter_.

The `CollectionItemSubset`returned instance contains a property called `totalItemCount` which is necessary for pagination.

#### Get Collection Featured Items

Returns a [FeaturedItem](../src/collections/domain/models/CollectionFeaturedItem.ts) array containing the featured items of the requested collection, given the collection identifier or alias.

##### Example call:

```typescript
import { getCollectionFeaturedItems } from '@iqss/dataverse-client-javascript'

const collectionIdOrAlias = 12345

getCollectionFeaturedItems
  .execute(collectionId)
  .then((featuredItems: FeaturedItem[]) => {
    /* ... */
  })
  .catch((error: Error) => {
    /* ... */
  })
```

_See [use case](../src/collections/domain/useCases/GetCollectionFeaturedItems.ts)_ definition.

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

If no collection identifier is specified, the default collection identifier; `:root` will be used. If you want to search for a different collection, you must add the collection identifier as a parameter in the use case call.

### Collections Write Use Cases

#### Create a Collection

Creates a new Collection, given a [CollectionDTO](../src/collections/domain/dtos/CollectionDTO.ts) object and an optional parent collection identifier, which defaults to `:root`.

##### Example call:

```typescript
import { createCollection } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionDTO: CollectionDTO = {
  alias: alias,
  name: 'Test Collection',
  contacts: ['dataverse@test.com'],
  type: CollectionType.DEPARTMENT
}

createCollection.execute(collectionDTO).then((createdCollectionId: number) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/collections/domain/useCases/CreateCollection.ts) implementation_.

The above example creates the new collection in the root collection since no collection identifier is specified. If you want to create the collection in a different collection, you must add the collection identifier as a second parameter in the use case call.

The use case returns a number, which is the identifier of the created collection.

#### Update a Collection

Updates an existing collection, given a collection identifier and a [CollectionDTO](../src/collections/domain/dtos/CollectionDTO.ts) including the updated collection data.

##### Example call:

```typescript
import { updateCollection } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 12345
const collectionDTO: CollectionDTO = {
  alias: alias,
  name: 'Updated Collection Name',
  contacts: ['dataverse@test.com'],
  type: CollectionType.DEPARTMENT
}

updateCollection.execute(collectionIdOrAlias, collectionDTO)

/* ... */
```

_See [use case](../src/collections/domain/useCases/UpdateCollection.ts) implementation_.

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

#### Publish a Collection

Publishes a Collection, given the collection identifier.

##### Example call:

```typescript
import { publishCollection } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 12345

publishCollection.execute(collectionIdOrAlias)

/* ... */
```

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

_See [use case](../src/collections/domain/useCases/PublishCollection.ts)_ definition.

### Delete a Collection

```typescript
import { deleteCollection } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 12345

deleteCollection.execute(collectionIdOrAlias)

/* ... */
```

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

_See [use case](../src/collections/domain/useCases/DeleteCollection.ts)_ definition.

#### Update Collection Featured Items

Updates all featured items, given a collection identifier and a FeaturedItemsDTO.

##### Example call:

```typescript
import { updateCollectionFeaturedItems } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 12345

updateCollectionFeaturedItems.execute(collectionIdOrAlias).then((featuredItems: FeaturedItem[]) => {
  /* ... */
})

/* ... */
```

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

_See [use case](../src/collections/domain/useCases/UpdateCollectionFeaturedItems.ts)_ definition.

#### Delete Collection Featured Items

Deletes all featured items from a collection, given a collection identifier.

##### Example call:

```typescript
import { deleteCollectionFeaturedItems } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 12345

deleteCollectionFeaturedItems.execute(collectionIdOrAlias)

/* ... */
```

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

_See [use case](../src/collections/domain/useCases/DeleteCollectionFeaturedItems.ts)_ definition.

#### Delete A Collection Featured Item

Deletes a single featured item, given a featured item id.

##### Example call:

```typescript
import { deleteCollectionFeaturedItem } from '@iqss/dataverse-client-javascript'

/* ... */

const featuredItemId = 12345

deleteCollectionFeaturedItem.execute(featuredItemId)

/* ... */
```

_See [use case](../src/collections/domain/useCases/DeleteCollectionFeaturedItem.ts)_ definition.

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

There is an optional fourth parameter called `keepRawFields`, which indicates whether or not to keep the metadata fields as they are and avoid the transformation to Markdown. The default value is `false`.

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

There is an optional second parameter called `keepRawFields`, which indicates whether or not to keep the metadata fields as they are and avoid the transformation to Markdown. The default value is `false`.

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

#### Get Differences between Two Dataset Versions

Returns an instance of [DatasetVersionDiff](../src/datasets/domain/models/DatasetVersionDiff.ts) that contains the differences between two Dataset Versions.

##### Example call:

```typescript
import { getDatasetVersionDiff } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'
const oldVersion = '1.0'
const newVersion = '2.0'

getDatasetVersionDiff
  .execute(datasetId, oldVersion, newVersion)
  .then((versionDiff: DatasetVersionDiff) => {
    /* ... */
  })

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetVersionDiff.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `oldVersion` and `newVersion` parameters specify the versions of the dataset to compare.

There is an optional third parameter called `includeDeaccessioned`, by default, deaccessioned dataset versions are not included in the search when applying the `:latest` or `:latest-published` identifiers. If not set, the default value is `false`.

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

Note that `collectionId` is an optional parameter to filter datasets by collection. If not set, the default value is `:root`.

The `DatasetPreviewSubset`returned instance contains a property called `totalDatasetCount` which is necessary for pagination.

#### Get Dataset Versions Summaries

Returns an array of [DatasetVersionSummaryInfo](../src/datasets/domain/models/DatasetVersionSummaryInfo.ts) that contains information about what changed in every specific version.

##### Example call:

```typescript
import { getDatasetVersionsSummaries } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'

getDatasetVersionsSummaries
  .execute(datasetId)
  .then((datasetVersionsSummaries: DatasetVersionSummaryInfo[]) => {
    /* ... */
  })

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetVersionsSummaries.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

### Datasets Write Use Cases

#### Create a Dataset

Creates a new Dataset in a collection, given a [DatasetDTO](../src/datasets/domain/dtos/DatasetDTO.ts) object and an optional collection identifier, which defaults to `:root`.

This use case validates the submitted fields of each metadata block and can return errors of type [ResourceValidationError](../src/core/domain/useCases/validators/errors/ResourceValidationError.ts), which include sufficient information to determine which field value is invalid and why.

##### Example call:

```typescript
import { createDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetDTO: DatasetDTO = {
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

createDataset.execute(datasetDTO).then((newDatasetIds: CreatedDatasetIdentifiers) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/datasets/domain/useCases/CreateDataset.ts) implementation_.

The above example creates the new dataset in the root collection since no collection identifier is specified. If you want to create the dataset in a different collection, you must add the collection identifier as a second parameter in the use case call.

The use case returns a [CreatedDatasetIdentifiers](../src/datasets/domain/models/CreatedDatasetIdentifiers.ts) object, which includes the persistent and numeric identifiers of the created dataset.

#### Update a Dataset

Updates an existing Dataset, given a [DatasetDTO](../src/datasets/domain/dtos/DatasetDTO.ts) with the updated information.

If a draft of the dataset already exists, the metadata of that draft is overwritten; otherwise, a new draft is created with the updated metadata.

This use case validates the submitted fields of each metadata block and can return errors of type [ResourceValidationError](../src/core/domain/useCases/validators/errors/ResourceValidationError.ts), which include sufficient information to determine which field value is invalid and why.

##### Example call:

```typescript
import { updateDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 1
const datasetDTO: DatasetDTO = {
  metadataBlockValues: [
    {
      name: 'citation',
      fields: {
        title: 'Updated Dataset',
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

updateDataset.execute(datasetId, datasetDTO)

/* ... */
```

_See [use case](../src/datasets/domain/useCases/UpdateDataset.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Publish a Dataset

Publishes a Dataset, given its identifier and the type of version update to perform.

##### Example call:

```typescript
import { publishDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA'
const versionUpdateType = VersionUpdateType.MINOR

publishDataset.execute(datasetId, versionUpdateType)

/* ... */
```

_See [use case](../src/datasets/domain/useCases/PublishDataset.ts) implementation_.

The above example publishes the dataset with the specified identifier and performs a minor version update. If the response
is successful, the use case does not return the dataset object, but the HTTP status code `200`. Otherwise, it throws an error.\
If you want to perform a major version update, you must set the `versionUpdateType` parameter to `VersionUpdateType.MAJOR`.\
Superusers can pass `VersionUpdateType.UPDATE_CURRENT` to update metadata without changing the version number. This will overwrite the latest published version and therefore will only work for a dataset that has been published at least once. \*Note that this will only work also if there were no file changes in the update.\
The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `versionUpdateType` parameter can be a [VersionUpdateType](../src/datasets/domain/models/VersionUpdateType.ts) enum value, which can be one of the following:

- `VersionUpdateType.MINOR`
- `VersionUpdateType.MAJOR`
- `VersionUpdateType.UPDATE_CURRENT`

#### Deaccession a Dataset

Deaccession a Dataset, given its identifier, version, and deaccessionDatasetDTO to perform.

##### Example call:

```typescript
import { deaccessionDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 1
const version = ':latestPublished'
const deaccessionDatasetDTO = {
  deaccessionReason: 'Description of the deaccession reason.',
  deaccessionForwardURL: 'https://demo.dataverse.org'
}

deaccessionDataset.execute(datasetId, version, deaccessionDatasetDTO)

/* ... */
```

_See [use case](../src/datasets/domain/useCases/DeaccessionDataset.ts) implementation_.
The `datasetId` parameter can be a string for persistent identifiers, or a number for numeric identifiers.
The `version` parameter should be a string or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value.

You cannot deaccession a dataset more than once. If you call this endpoint twice for the same dataset version, you will get a not found error on the second call, since the dataset you are looking for will no longer be published since it is already deaccessioned.

#### Delete a Draft Dataset

Delete a Draft Dataset, given its identifier.

##### Example call:

```typescript
import { deleteDatasetDraft } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 1

deleteDatasetDraft.execute(datasetId)

/* ... */
```

_See [use case](../src/datasets/domain/useCases/DeleteDatasetDraft.ts) implementation_.

The `datasetId` parameter is a number for numeric identifiers or string for persistent identifiers.

If you try to delete a dataset without draft version, you will get a not found error.

#### Get Download Count of a Dataset

Total number of downloads requested for a dataset, given a dataset numeric identifier,

##### Example call:

```typescript
import { getDatasetDownloadCount } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 1
const includeMDC = true

getDatasetDownloadCount
  .execute(datasetId, includeMDC)
  .then((datasetDownloadCount: DatasetDownloadCount) => {
    /* ... */
  })

/* ... */
```

_See [use case](../src/datasets/domain/useCases/GetDatasetDownloadCount.ts) implementation_.

The `datasetId` parameter is a number for numeric identifiers or string for persistent identifiers.
The `includeMDC` parameter is optional.

- Setting `includeMDC` to True will ignore the `MDCStartDate` setting and return a total count.
- If MDC isn't enabled, the download count will return a total count, without `MDCStartDate`.
- If MDC is enabled but the `includeMDC` is false, the count will be limited to the time before `MDCStartDate`

## Files

### Files read use cases

#### Get a File

Returns a [FileModel](../src/files/domain/models/FileModel.ts) instance, given the search parameters to identify it.

##### Example call:

```typescript
import { getFile } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 2
const datasetVersionId = '1.0'

getFile.execute(fileId, datasetVersionId).then((file: FileModel) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFile.ts)_ definition.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.

There is an optional third parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the file search. If not set, the default value is `false`.

#### Get a File and its Dataset

Returns a tuple of [FileModel](../src/files/domain/models/FileModel.ts) and [Dataset](../src/datasets/domain/models/Dataset.ts) objects (`[FileModel, Dataset]`), given the search parameters to identify the file.

The returned dataset object corresponds to the dataset version associated with the requested file.

##### Example call:

```typescript
import { getFileAndDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 2
const datasetVersionId = '1.0'

getFileAndDataset.execute(fileId, datasetVersionId).then((fileAndDataset: [FileModel, Dataset]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileAndDataset.ts)_ definition.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The optional `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, the default value is `DatasetNotNumberedVersion.LATEST`.

There is an optional third parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the file search. If not set, the default value is `false`.

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

### Files write use cases

#### File Uploading Use Cases

These use cases are designed to facilitate the uploading of files to a remote S3 storage and subsequently adding them to a dataset. This process involves two main steps / use cases:

1. Uploading a file to remote S3 storage and obtaining a storage identifier.
2. Adding one or more uploaded files to the dataset using the obtained storage identifiers.

This use case flow is entirely based on the Direct Upload API as described in the Dataverse documentation: https://guides.dataverse.org/en/latest/developers/s3-direct-upload-api.html

##### Upload File

This use case uploads a file to a remote S3 storage and returns the storage identifier associated with the file.

###### Example call:

```typescript
import { uploadFile } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId: number | string = 123
const file = new File(['content'], 'example.txt', { type: 'text/plain' })
const progressCallback = (progress) => console.log(`Upload progress: ${progress}%`)
const abortController = new AbortController()

uploadFile.execute(datasetId, file, progressCallback, abortController).then((storageId) => {
  console.log(`File uploaded successfully with storage ID: ${storageId}`)
})

/* ... */
```

_See [use case](../src/files/domain/useCases/UploadFile.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `file` parameter is a subclass of Blob (Binary Large Object) that represents a file.

The `progress` parameter represents a callback function that allows the caller to monitor the progress of the file uploading operation.

The `abortController` is a built-in mechanism in modern web browsers that allows the cancellation of asynchronous operations. It works in conjunction with an associated AbortSignal, which will be passed to the file uploading API calls to monitor whether the operation should be aborted, if the caller decides to cancel the operation midway.

##### Add Uploaded Files to the Dataset

This use case involves adding files that have been previously uploaded to remote storage to the dataset.

###### Example call:

```typescript
import { addUploadedFilesToDataset } from '@iqss/dataverse-client-javascript'
import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId: number | string = 123
const uploadedFileDTOs: UploadedFileDTO[] = [
  {
    fileName: 'the-file-name',
    storageId: 'localstack1://mybucket:19121faf7e7-2c40322ff54e',
    checksumType: 'md5',
    checksumValue: 'ede3d3b685b4e137ba4cb2521329a75e',
    mimeType: 'text/plain'
  }
]

addUploadedFilesToDataset.execute(datasetId, uploadedFileDTOs).then(() => {
  console.log('Files added to the dataset successfully.')
})

/* ... */
```

_See [use case](../src/files/domain/useCases/AddUploadedFilesToDataset.ts) implementation_.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `uploadedFileDTOs` parameter is an array of [UploadedFileDTO](../src/files/domain/dtos/UploadedFileDTO.ts) and includes properties related to the uploaded files. Some of these properties should be calculated from the uploaded File Blob objects and the resulting storage identifiers from the Upload File use case.

##### Error handling:

These use cases involve multiple steps, each associated with different API calls, which introduce various points of potential failure. Therefore, different error types have been implemented according to their nature, all of which extend [DirectUploadClientError](../src/files/domain/clients/DirectUploadClientError.ts).

The following errors might arise from the `UploadFile` use case:

- UrlGenerationError: This error indicates that the destination URLs for file upload could not be generated successfully.

- FilePartUploadError: This error indicates that the retry limit has been exceeded for uploading one of the parts of a multipart file. If this error is received, it is because the abort endpoint has been successfully called.

- MultipartAbortError: This error indicates that it was not possible to call the abort endpoint after an error occurred during the upload of one of the parts of a multipart file.

- MultipartCompletionError: This error indicates that the multipart upload could not be completed due to an error encountered when calling the completion endpoint.

- FileUploadError: This error indicates that there has been an error while uploading a single-part file.

- FileUploadCancelError: This error is received when the caller cancels the operation through the abort controller.

The following error might arise from the `AddUploadedFileToDataset` use case:

- AddUploadedFileToDatasetError: This error indicates that there was an error while adding the uploaded file to the dataset.

#### Update File Metadata

Updates Metadata of a File.

###### Example call:

```typescript
import { updateFileMetadata } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId: number | string = 123
const updateFileMetadataDTO = {
  label: 'myfile.txt',
  directoryLabel: 'mydir',
  description: 'My description bbb.',
  categories: ['Data'],
  restrict: false
}

await updateFileMetadata.execute(fileId, updateFileMetadataDTO).then(() => {
  console.log(`File updated successfully`)
})
```

_See [use case](../src/files/domain/useCases/UpdateFileMetadata.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Update File Categories

Updates Categories of a File.

###### Example call:

```typescript
import { updateFileCategories } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId: number | string = 123
const categories = ['category 1', 'category 1']
const replace = true

await updateFileCategories.execute(fileId, categories, replace).then(() => {
  console.log(`File updated successfully`)
})
```

_See [use case](../src/files/domain/useCases/updateFileCategories.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Update File Tabular Tags

Updates Tabular Tags of a File.

###### Example call:

```typescript
import { updateFileTabularTags } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId: number | string = 123
const tabularTags = ['Surveys']

await updateFileTabularTags.execute(fileId, tabularTags, replace).then(() => {
  console.log(`File updated successfully`)
})
```

_See [use case](../src/files/domain/useCases/updateFileTabularTags.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Delete a File

Deletes a File.

##### Example call:

```typescript
import { deleteFile } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 12345

deleteFile.execute(fileId)

/* ... */
```

_See [use case](../src/files/domain/useCases/DeleteFile.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

Note that the behavior of deleting files depends on if the dataset has ever been published or not.

- If the dataset has never been published, the file will be deleted forever.
- If the dataset has published, the file is deleted from the draft (and future published versions).
- If the dataset has published, the deleted file can still be downloaded because it was part of a published version.

#### Replace a File

Replaces a File. Currently working for already uploaded S3 bucket files.

##### Example call:

```typescript
import { replaceFile } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 12345
const uploadedFileDTO: UploadedFileDTO = {
  fileName: 'the-file-name',
  storageId: 'localstack1://mybucket:19121faf7e7-2c40322ff54e',
  checksumType: 'md5',
  checksumValue: 'ede3d3b685b4e137ba4cb2521329a75e',
  mimeType: 'text/plain'
}

replaceFile.execute(fileId, uploadedFileDTO).then((newFileId: number) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/ReplaceFile.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `uploadedFileDTO` parameter is a [UploadedFileDTO](../src/files/domain/dtos/UploadedFileDTO.ts) and includes properties related to the uploaded files. Some of these properties should be calculated from the uploaded File Blob objects and the resulting storage identifiers from the Upload File use case.

The use case returns a number, which is the identifier of the new file.

#### Restrict or Unrestrict a File

Restrict or unrestrict an existing file, given a [RestrictFileDTO](../src/users/domain/dtos/RestrictFileDTO.ts)

##### Example call:

```typescript
import { restrictFile } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 12345
const restrictFileDTO = {
  restrict: true,
  enableAccessRequest: false,
  termsOfAccess: 'terms of access'
}

restrictFile.execute(fileId, restrictFileDTO)

/* ... */
```

_See [use case](../src/files/domain/useCases/RestrictFile.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.
If restrict is false then enableAccessRequest and termsOfAccess are ignored
If restrict is true and enableAccessRequest is false then termsOfAccess is required.
The enableAccessRequest and termsOfAccess are applied to the Draft version of the Dataset and affect all of the restricted files in said Draft version.

#### Is File Deleted

Check if the file has been deleted, return a boolean.

##### Example call:

```typescript
import { isFileDeleted } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 12345

await isFileDeleted.execute(fileId).then((isDeleted: boolean) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/isFileDeleted.ts) implementation_.

The `fileId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

#### Get File Version Summaries

Get the file versions summaries, return a list of summaries for each version

##### Example call:

```typescript
import { getFileVersionSummaries } from '@iqss/dataverse-client-javascript'

/* ... */

const fileId = 1

getFileVersionSummaries.execute(fileId).then((fileVersionSummaries: fileVersionSummaryInfo[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/files/domain/useCases/GetFileVersionSummaries.ts) implementation_.

## Metadata Blocks

### Metadata Blocks read use cases

#### Get All Facetable Metadata Fields

Returns a [MetadataFieldInfo](../src/metadataBlocks/domain/models/MetadataBlock.ts) array containing all facetable metadata fields defined in the installation.

##### Example call:

```typescript
import { getAllFacetableMetadataFields } from '@iqss/dataverse-client-javascript'

/* ... */

getAllFacetableMetadataFields.execute().then((metadataFieldInfos: MetadataFieldInfo[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/metadataBlocks/domain/useCases/GetAllFacetableMetadataFields.ts) implementation_.

#### Get All Metadata Blocks

Returns a [MetadataBlock](../src/metadataBlocks/domain/models/MetadataBlock.ts) array containing the metadata blocks defined in the installation.

##### Example call:

```typescript
import { getAllMetadataBlocks } from '@iqss/dataverse-client-javascript'

/* ... */

getAllMetadataBlocks.execute().then((metadataBlocks: MetadataBlock[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/metadataBlocks/domain/useCases/GetAllMetadataBlocks.ts) implementation_.

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

#### Get Collection Metadata Blocks

Returns a [MetadataBlock](../src/metadataBlocks/domain/models/MetadataBlock.ts) array containing the metadata blocks from the requested collection.

##### Example call:

```typescript
import { getCollectionMetadataBlocks } from '@iqss/dataverse-client-javascript'

/* ... */

const collectionIdOrAlias = 'citation'

getCollectionMetadataBlocks.execute(collectionAlias).then((metadataBlocks: MetadataBlock[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/metadataBlocks/domain/useCases/GetCollectionMetadataBlocks.ts) implementation_.

The `collectionIdOrAlias` is a generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId).

There is a second optional parameter called `onlyDisplayedOnCreate` which indicates whether or not to return only the metadata blocks that are displayed on dataset creation. The default value is false.

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

### Get Current API Token

Returns the current [ApiTokenInfo](../src/users/domain/models/ApiTokenInfo.ts) corresponding to the current authenticated user.

##### Example call:

```typescript
import { getCurrentApiToken } from '@iqss/dataverse-client-javascript'

/* ... */

getCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfo) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/users/domain/useCases/GetCurrentApiToken.ts) implementation_.

### Users write use cases

### Delete Current API Token

Deletes the API token of the current authenticated user.

##### Example call:

```typescript
import { deleteCurrentApiToken } from '@iqss/dataverse-client-javascript'

/* ... */

deleteCurrentApiToken.execute()

/* ... */
```

_See [use case](../src/users/domain/useCases/DeleteCurrentApiToken.ts) implementation_.

### Recreate Current API Token

Reacreates the API token of the current authenticated user and returns the new [ApiTokenInfo](../src/users/domain/models/ApiTokenInfo.ts).

##### Example call:

```typescript
import { recreateCurrentApiToken } from '@iqss/dataverse-client-javascript'

/* ... */

recreateCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfo) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/users/domain/useCases/RecreateCurrentApiToken.ts) implementation_.

### Register User

Register a new user, given a [UserDTO](../src/users/domain/dtos/UserDTO.ts)

##### Example call:

```typescript
import { registerUser } from '@iqss/dataverse-client-javascript'

/* ... */

const userDTO: UserDTO = {
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'johndoe@email.com',
  position: '',
  affiliation: '',
  termsAccepted: true
}

registerUser.execute(userDTO)

/* ... */
```

_See [use case](../src/users/domain/useCases/RegisterUser.ts) implementation_.

## Roles

### Get User Selectable Roles

Returns a [Role](../src/roles/domain/models/Role.ts) array that the calling user can use as filters when searching within their data.

##### Example call:

```typescript
import { getUserSelectableRoles } from '@iqss/dataverse-client-javascript'

/* ... */

getUserSelectableRoles.execute().then((roles: Role[]) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/roles/domain/useCases/GetUserSelectableRoles.ts) implementation_.

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

#### Get Application Terms of Use

Returns the Application Terms of Use. If you have enabled Internationalization you can pass a two-character language code (e.g. “en”) as the lang parameter.

##### Example call:

```typescript
import { getApplicationTermsOfUse } from '@iqss/dataverse-client-javascript'

/* ... */

getApplicationTermsOfUse.execute().then((termsOfUse: string) => {
  /* ... */
})

/* ... */
```

_See [use case](../src/info/domain/useCases/GetApplicationTermsOfUse.ts) implementation_.

## Contact

#### Send Feedback to Object Contacts

Returns a [Contact](../src/contactInfo/domain/models/Contact.ts) object, which contains contact return information, showing fromEmail, subject, body.

##### Example call:

```typescript
import { submitContactInfo } from '@iqss/dataverse-client-javascript'

/* ... */

const contactDTO: ContactDTO = {
  targedId: 1
  subject: 'Data Question',
  body: 'Please help me understand your data. Thank you!',
  fromEmail: 'test@gmail.com'
}

submitContactInfo.execute(contactDTO)

/* ... */
```

_See [use case](../src/info/domain/useCases/submitContactInfo.ts) implementation_.

The above example would submit feedback to all contacts of a object where the object targetId = 1.

In ContactDTO, it takes the following information:

- **targetId**: the numeric identifier of the collection, dataset, or datafile. Persistent ids and collection aliases are not supported. (Optional)
- **identifier**: the alias of a collection or the persistence id of a dataset or datafile. (Optional)
- **subject**: the email subject line.
- **body**: the email body to send.
- **fromEmail**: the email to list in the reply-to field.
