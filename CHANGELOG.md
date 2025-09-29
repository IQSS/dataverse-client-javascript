# Changelog

All notable changes to **Dataverse Client Javascript** are documented here.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

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
