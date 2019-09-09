# js-dataverse
A JavaScript/TypeScript client for [Dataverse](http://guides.dataverse.org/en/latest/api/).

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
`public getDataverseInformation(alias: string): Promise<AxiosResponse> {`

`public listDatasets(alias: string): Promise<AxiosResponse> {`

`public search(options: SearchOptions): Promise<AxiosResponse> {`

`public getFile(fileId: string): Promise<AxiosResponse> {`

`public getFileMetadata(fileId: string, draftVersion: boolean = false): Promise<AxiosResponse> {`

`public getDatasetInformation(datasetId: string, datasetVersion: string): Promise<AxiosResponse> {`

`public listDataverseRoleAssignments(dataverseAlias: string): Promise<AxiosResponse> {`
## Contributing
[If you are interested in contributing, please click here](/CONTRIBUTING.md)