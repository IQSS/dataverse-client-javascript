# Changelog

All notable changes to **Dataverse Client Javascript** are documented here.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Datasets: Added `updateDatasetLicense` use case and repository method to support Dataverse endpoint `PUT /datasets/{id}/license`, for updating dataset license or custom terms
- New Use Case: [Get Collections For Linking Use Case](./docs/useCases.md#get-collections-for-linking).
- New Use Case: [Create a Dataset Template](./docs/useCases.md#create-a-dataset-template) under Collections.

- New Use Case: [Update Terms of Access](./docs/useCases.md#update-terms-of-access).
- Files: Added `FilesConfig` class for configuring file upload behavior at runtime, including:
  - `useS3Tagging`: Option to disable S3 object tagging (`x-amz-tagging` header) for S3-compatible storage that doesn't support tagging. Default: `true`.
  - `maxMultipartRetries`: Configurable maximum retries for multipart upload parts. Default: `5`.
  - `fileUploadTimeoutMs`: Configurable timeout for file upload operations. Default: `60000`.

### Changed

- Add pagination query parameters to Dataset Version Summeries and File Version Summaries use cases
- Files: `DirectUploadClient` constructor now accepts a `DirectUploadClientConfig` object instead of a plain number for `maxMultipartRetries`.

### Fixed

### Removed

- Removed date fields validations in create and update dataset use cases, since validation is already handled in the backend and SPA frontend (other clients should perform client side validation also). This avoids duplicated logic and keeps the package focused on its core responsibility.

[Unreleased]: https://github.com/IQSS/dataverse-client-javascript/compare/v2.1.0...develop

---

## [v2.1.0] -- 2025-09-29

### Added

- CHANGELOG.md file to track changes in a standard way.

- New property isAdvancedSearchFieldType returned by API in GetCollectionMetadataBlocks and GetMetadataBlockByName use cases.

- Use cases for Notifications: GetAllNotifications, DeleteNotification.

- Use cases for Dataset Linking: LinkDataset, UnlinkDataset, GetDatasetLinkedCollections.

- Use case: GetCitationInOtherFormats.

- Use case: GetDatasetAvailableCategories.

- Use cases for Collections Linking: LinkCollection, UnlinkCollection, GetCollectionLinks.

- Use cases for External Tools: GetExternalTools, GetDatasetExternalToolResolved, GetFileExternalToolResolved.

- Use case: GetDatasetTemplates.

- Use case: GetAvailableStandardLicenses.

- Use case: GetAvailableDatasetMetadataExportFormats.

- Use cases for Dataset Types: GetDatasetAvailableDatasetTypes, GetDatasetAvailableDatasetType, AddDatasetType, LinkDatasetTypeWithMetadataBlocks, SetAvailableLicensesForDatasetType, DeleteDatasetType.

### Changed

- CreateDataset use case updated to allow non-default dataset types.

- GetCollectionMetadataBlocks use case updated to support passing a dataset type.

### Fixed

- Integration tests in Roles Repository.

- Incorrect Filter Queries split that caused value parts to be truncated.

### Security

- Dependencies updated to address vulnerabilities found by npm audit.
