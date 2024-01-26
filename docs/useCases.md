# Use Cases

In the context of Domain-Driven Design (DDD), a use case is a specific way to describe and capture a user's or system's interaction with the domain to achieve a particular goal. 

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

Returns a [Dataset](../src/datasets/domain/models/Dataset.ts) instance, given the parameters that identify it.

##### Example call:

````typescript
import { getAllDatasetPreviews } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetId = 'doi:10.77777/FK2/AAAAAA';
const datasetVersionId = 20;

getDataset
  .execute(datasetId, datasetVersionId)
  .then((dataset: Dataset) => {
    /* ... */
  });
  
/* ... */
````

*See [use case](../src/datasets/domain/useCases/GetDataset.ts)* definition.


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
