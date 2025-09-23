## Dataverse JavaScript Client

![NPM Version](https://img.shields.io/npm/v/%40iqss%2Fdataverse-client-javascript)

The Dataverse JavaScript Client is an open-source package that provides a set of use-case-driven functions to interact with the [Dataverse API](http://guides.dataverse.org/en/latest/api/). Designed around Domain-Driven Design (DDD) principles, this package offers a structured, high-level interface to perform actions like retrieving datasets, managing collections, uploading files, and more.

This package is part of the Dataverse Frontend ecosystem and is intended to be used by applications or services that integrate with the Dataverse platform.

## Features

- **Use case-centric API functions** – Organized around domain-specific actions like `getDataset`, `createCollection`, or `restrictFile`.
- **TypeScript-first** – All use cases include strong typings for inputs and outputs, improving developer experience.

## Installation

Install the package via npm:

```bash
npm install @iqss/dataverse-client-javascript
```

## Usage

```typescript
import { getDataset } from '@iqss/dataverse-client-javascript'

/* ... */

const datasetIdentifier = 'doi:10.77777/FK2/AAAAAA'
const datasetVersion = '1.0'

getDataset.execute(datasetIdentifier, datasetVersion).then((dataset: Dataset) => {
  /* ... */
})

/* ... */
```

For detailed information about available use cases see [Use Cases Docs](https://github.com/IQSS/dataverse-client-javascript/blob/main/docs/useCases.md).

For detailed information about usage see [Usage Docs](https://github.com/IQSS/dataverse-client-javascript/blob/main/docs/usage.md).

## Changelog

See [CHANGELOG.md](https://github.com/IQSS/dataverse-client-javascript/blob/main/CHANGELOG.md) for a detailed history of changes to this project.

## Contributing

Want to add a new use case or improve an existing one? Please check the [Contributing](https://github.com/IQSS/dataverse-client-javascript/blob/main/CONTRIBUTING.md) section.

## License

This project is open source and available under the [MIT License](https://github.com/IQSS/dataverse-client-javascript/blob/main/LICENSE).
