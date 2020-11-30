# dataverse-client-javascript
[![npm](https://img.shields.io/npm/v/js-dataverse.svg)](https://www.npmjs.com/package/js-dataverse)

A JavaScript/TypeScript client for [Dataverse](http://guides.dataverse.org/en/latest/api/).

## NPM
Module available as `js-dataverse` at https://www.npmjs.com/package/js-dataverse

## Usage
Create a new client:
```
const client = new DataverseClient('https://demo.dataverse.org/')
```

Request dataset information:
```
const response = await client.getDataverseInformation('myDataverseAlias')
```

## Current available functions
`public async getDataverseInformation(alias: string): Promise<AxiosResponse> {`

`public async listDatasets(alias: string): Promise<AxiosResponse> {`

`public async addDataset(dataverseAlias: string, payload: string): Promise<AxiosResponse> {`

`public async addBasicDataset(dataverseAlias: string, datasetInformation: BasicDatasetInformation): Promise<AxiosResponse> {`

`public async search(options: SearchOptions): Promise<AxiosResponse> {`

`public async searchOnlyPublished(options: SearchOptions): Promise<AxiosResponse> {`

`public async getFile(fileId: string): Promise<AxiosResponse> {`

`public async getFileMetadata(fileId: string, draftVersion: boolean = false): Promise<AxiosResponse> {`

`public async getLatestDatasetInformation(datasetId: string): Promise<AxiosResponse> {`

`public async getLatestPublishedDatasetVersion(datasetId: string): Promise<AxiosResponse> {`

`public async getDraftDatasetVersion(datasetId: string): Promise<AxiosResponse> {`

`public async getLatestDatasetInformationFromDOI(doi: string): Promise<AxiosResponse> {`

`public async getDatasetVersions(datasetId: string): Promise<AxiosResponse> {`

```
public async getDatasetVersion(datasetId: string, version: string): Promise<AxiosResponse> {

Note: Version must be published, e.g.:
http://demo.dataverse.org/api/datasets/389608/versions/1
```

`public async listDataverseRoleAssignments(dataverseAlias: string): Promise<AxiosResponse> {`

`public async getMetric(datasetId: string, metricType: DataverseMetricType, yearMonth?: string): Promise<AxiosResponse> {`

`public async getMetricByCountry(datasetId: string, metricType: DataverseMetricType, countryCode?: string, yearMonth?: string) {`

`public async replaceFile(fileId: string, filename: string, fileBuffer: Buffer, jsonData: object = {}): Promise<any> {`

`public async publishDataset(datasetId: string, versionUpgradeType: DatasetVersionUpgradeType = DatasetVersionUpgradeType.MAJOR): Promise<AxiosResponse> {`

`public async updateDataset(datasetId: string, datasetInformation: BasicDatasetInformation): Promise<AxiosResponse> {`

`public async deleteDataset(datasetId: string): Promise<AxiosResponse> {`

`public async getDatasetFiles(datasetId: string): Promise<AxiosResponse> {`

## Build project

In order to build the project, we need to run the following command:

`yarn build` or `npm run build`

the build generated will be placed in `dist` folder.

## Tests and checks

### Pre-requisites
Make sure that you install all the project dependencies

`yarn install` or `npm install`

Keep consistent, whether you use yarn or npm

### Running tests in CICD pipeline

`yarn test:ci` or `npm run test:ci`

### Test coverage

`yarn test:coverage` or `npm run test:coverage`

### Format checks
Making sure that the code format is following the guidelines

`yarn format:check` or `npm run format:check`

### Lint checks
Running a linting check on the code

`yarn eslint:check` or `npm run eslint:check`


## Publishing new version

Automated publishing of versions could be automated when merging to master. Below are the steps that would be required to publish a new version:

1. Run tests and checks
2. Build the project
3. Commit changes
4. Upgrade npm version
5. Publish, `npm publish`

## Contributing
[If you are interested in contributing, please click here](/CONTRIBUTING.md)
