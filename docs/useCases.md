# Use Cases

In the context of Domain-Driven Design (DDD), a use case is a specific way to describe and capture a user's or system's interaction with the domain to achieve a particular goal. 

This package exposes the functionality in the form of use cases, with the main goal that any package consumer can easily identify the desired functionality.

The different use cases currently available in the package are classified below, according to the subdomains they target:

## Datasets

### Read operations

#### [GetAllDatasetPreviews](../src/datasets/domain/useCases/GetAllDatasetPreviews.ts)

Returns an instance of [DatasetPreviewSubset](../src/datasets/domain/models/DatasetPreviewSubset.ts) that contains information for each dataset that the calling user can access in the installation.

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

Note that `limit` and `offset` are optional parameters for pagination.

#### [GetDataset](../src/datasets/domain/useCases/GetDataset.ts)

TODO

## Files

TODO

## Metadata Blocks

TODO

## Users

TODO

## Info

TODO
