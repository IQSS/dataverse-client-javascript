# Changelog

All notable changes to **Dataverse Client Javascript** are documented here.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Collections: Added `allowedDatasetTypes` field to the [Collection](./src/collections/domain/models/Collection.ts) model. This field is optional and only populated the feature is enabled on the installation and configured on the collection.

### Changed

### Fixed

### Removed

## [v2.2.0] -- 2026-04-24

### Added

- Datasets: Added `updateDatasetLicense` use case and repository method to support Dataverse endpoint `PUT /datasets/{id}/license`, for updating dataset license or custom terms.
- Datasets: Added `getDatasetStorageDriver` use case and repository method to support Dataverse endpoint `GET /datasets/{identifier}/storageDriver`, for retrieving dataset storage driver configuration with properties: name, type, label, directUpload, directDownload, and uploadOutOfBand.
- Datasets: Added `getDatasetUploadLimits` use case and repository method to support Dataverse endpoint `GET /datasets/{id}/uploadlimits`, for retrieving remaining storage upload quotas, if present.
- New Use Case: [Get Collections For Linking Use Case](./docs/useCases.md#get-collections-for-linking).
- New Use Case: [Create a Template](./docs/useCases.md#create-a-template) under Templates.
- New Use Case: [Get a Template](./docs/useCases.md#get-a-template) under Templates.
- New Use Case: [Delete a Template](./docs/useCases.md#delete-a-template) under Templates.
- Templates: Added `setTemplateAsDefault` use case and repository method to support Dataverse endpoint `POST /dataverses/{id}/template/default/{templateId}`.
- Templates: Added `unsetTemplateAsDefault` use case and repository method to support Dataverse endpoint `DELETE /dataverses/{id}/template/default`.
- New Use Case: [Update Terms of Access](./docs/useCases.md#update-terms-of-access).
- Guestbooks: Added use cases and repository support for guestbook creation, listing, and enabling/disabling.
- Guestbooks: Added dataset-level guestbook assignment and removal support via `assignDatasetGuestbook` (`PUT /api/datasets/{identifier}/guestbook`) and `removeDatasetGuestbook` (`DELETE /api/datasets/{identifier}/guestbook`).
- Datasets/Guestbooks: Added `guestbookId` in `getDataset` responses.
- Access: Added`access` module for guestbook-at-request and download terms/guestbook submission endpoints.
- New Use Case: [Get Publish Dataset Disclaimer Text](./docs/useCases.md#get-publish-dataset-disclaimer-text).
- New Use Case: [Get Dataset Publish Popup Custom Text](./docs/useCases.md#get-dataset-publish-popup-custom-text).
- DatasetType: Updated datasetType data model. Added two more fields: description and displayName.

### Changed

- Add pagination query parameters to Dataset Version Summeries and File Version Summaries use cases.
- Templates: Rename `CreateDatasetTemplateDTO` to `CreateTemplateDTO`.
- Templates: Rename `createDatasetTemplate` repository method to `createTemplate`.
- Templates: Rename `getDatasetTemplates` repository method to `getTemplatesByCollectionId`.
- Collections: `updateCollection` now supports partial updates by accepting `Partial<CollectionDTO>`. Only explicitly provided fields are sent in update requests, aligning with Dataverse API semantics. Metadata blocks handling was adjusted to respect inheritance flags and avoid invalid field combinations.

### Fixed

- In GetAllNotificationsByUser use case, additionalInfo field is returned as an object instead of a string.
- In GetAllNotificationsByUser use case, added support for filtering unread messages and pagination.

### Removed

- Removed date fields validations in create and update dataset use cases, since validation is already handled in the backend and SPA frontend (other clients should perform client side validation also). This avoids duplicated logic and keeps the package focused on its core responsibility.

[Unreleased]: https://github.com/IQSS/dataverse-client-javascript/compare/v2.2.0...develop

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

- Use case: GetTemplatesByCollectionId.

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
