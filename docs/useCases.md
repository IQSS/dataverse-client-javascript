# Use Cases

In the context of [Domain-Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html), a use case is a specific way to describe and capture a user's or system's interaction with the domain to achieve a particular goal. 

This package exposes the functionality in the form of use cases, with the main goal that any package consumer can easily identify the desired functionality.

The different use cases currently available in the package are classified below, according to the subdomains they target:

## Table of Contents

- [Datasets](#Datasets)
  - [Datasets read use cases](#datasets-read-use-cases)
    - [Get a dataset](#get-a-dataset)
    - [List all datasets](#list-all-datasets)
- [Files](#Files)
- [Metadata Blocks](#metadata-blocks)
- [Users](#Users)
- [Info](#Info)

## Datasets

### Datasets read use cases

#### Get a dataset

Returns a [Dataset](../src/datasets/domain/models/Dataset.ts) instance, given the search parameters to identify it.

##### Example call:

````typescript
import { getAllDatasetPreviews } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA';
const datasetVersionId = '1.0';

getDataset
  .execute(datasetId, datasetVersionId)
  .then((dataset: Dataset) => {
    /* ... */
  });
  
/* ... */
````

*See [use case](../src/datasets/domain/useCases/GetDataset.ts)* definition.

The `datasetId` parameter can be a string, for persistent identifiers, or a number, for numeric identifiers.

The `datasetVersionId` parameter can correspond to a numeric version identifier, as in the previous example, or a [DatasetNotNumberedVersion](../src/datasets/domain/models/DatasetNotNumberedVersion.ts) enum value. If not set, parameter the default value is `DatasetNotNumberedVersion.LATEST`.

There is a third optional parameter called `includeDeaccessioned`, which indicates whether to consider deaccessioned versions or not in the dataset search. If not set, parameter the default value is `false`.



#### List all datasets

Returns an instance of [DatasetPreviewSubset](../src/datasets/domain/models/DatasetPreviewSubset.ts) that contains reduced information for each dataset that the calling user can access in the installation.

##### Example call:

````typescript
import { getAllDatasetPreviews } from '@iqss/dataverse-client-javascript'

/* ... */

const limit = 10;
const offset = 20;

getAllDatasetPreviews
  .execute(limit, offset)
  .then((subset: DatasetPreviewSubset) => {
    /* ... */
  });
  
/* ... */
````

*See [use case](../src/datasets/domain/useCases/GetAllDatasetPreviews.ts) definition*.

Note that `limit` and `offset` are optional parameters for pagination.

The `DatasetPreviewSubset`returned instance contains a property called `totalDatasetCount` which is necessary for pagination.

## Files

TODO

## Metadata Blocks

TODO

## Users

TODO

## Info

TODO
