# Changelog

All notable changes to **Dataverse Client Javascript** are documented here.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- New Use Case: [Update Dataset License](./docs/useCases.md#update-dataset-license) under Datasets.
- New Use Case: [Get Dataset Storage Driver](./docs/useCases.md#get-dataset-storage-driver) under Datasets.
- New Use Case: [Get Dataset Upload Limits](./docs/useCases.md#get-dataset-upload-limits) under Datasets.
- New Use Case: [Update Terms of Access](./docs/useCases.md#update-terms-of-access) under Datasets.
- New Use Case: [Create a Template](./docs/useCases.md#create-a-template) under Templates.
- New Use Case: [Get a Template](./docs/useCases.md#get-a-template) under Templates.
- New Use Case: [Delete a Template](./docs/useCases.md#delete-a-template) under Templates.
- New Use Case: [Set Template as Default](./docs/useCases.md#set-template-as-default) under Templates.
- New Use Case: [Unset Template as Default](./docs/useCases.md#unset-template-as-default) under Templates.
- New Use Case: [Create Guestbook](./docs/useCases.md#create-guestbook) under Guestbooks.
- New Use Case: [Get Guestbooks](./docs/useCases.md#get-guestbooks) under Guestbooks.
- New Use Case: [Enable Guestbook](./docs/useCases.md#enable-guestbook) under Guestbooks.
- New Use Case: [Disable Guestbook](./docs/useCases.md#disable-guestbook) under Guestbooks.
- New Use Case: [Assign Dataset Guestbook](./docs/useCases.md#assign-dataset-guestbook) under Guestbooks.
- New Use Case: [Remove Dataset Guestbook](./docs/useCases.md#remove-dataset-guestbook) under Guestbooks.
- New Use Case: [Get Publish Dataset Disclaimer Text](./docs/useCases.md#get-publish-dataset-disclaimer-text).
- New Use Case: [Get Dataset Publish Popup Custom Text](./docs/useCases.md#get-dataset-publish-popup-custom-text).
- New Use Case: [Get Allowed Collection Storage Drivers](./docs/useCases.md#get-allowed-collection-storage-drivers) under Collections.
- New Use Case: [Get Collection Storage Driver](./docs/useCases.md#get-collection-storage-driver) under Collections.
- New Use Case: [Set Collection Storage Driver](./docs/useCases.md#set-collection-storage-driver) under Collections.
- New Use Case: [Delete Collection Storage Driver](./docs/useCases.md#delete-collection-storage-driver) under Collections.
- New Use Case: [Get Collections For Linking](./docs/useCases.md#get-collections-for-linking) under Collections.
- Access: Added `access` module for guestbook-at-request and download terms/guestbook submission endpoints.
- DatasetType: Updated datasetType data model. Added two more fields: description and displayName.

### Changed

- Add pagination query parameters to Dataset Version Summeries and File Version Summaries use cases.
- Templates: Rename `CreateDatasetTemplateDTO` to `CreateTemplateDTO`.
- Templates: Rename `createDatasetTemplate` repository method to `createTemplate`.
- Templates: Rename `getDatasetTemplates` repository method to `getTemplatesByCollectionId`.
- Datasets/Guestbooks: Added `guestbookId` in `getDataset` responses.
- DatasetType: Updated datasetType data model. Added two more fields: description and displayName.

### Fixed

- In GetAllNotificationsByUser use case, additionalInfo field is returned as an object instead of a string.
- In GetAllNotificationsByUser use case, added support for filtering unread messages and pagination.

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
