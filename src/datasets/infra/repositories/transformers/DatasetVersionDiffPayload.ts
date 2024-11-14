/*
{
    "status": "OK",
    "data": {
        "oldVersion": {
            "versionNumber": "1.0",
            "lastUpdatedDate": "2024-10-24T15:17:11Z"
        },
        "newVersion": {
            "versionNumber": "DRAFT",
            "lastUpdatedDate": "2024-10-24T15:17:16Z"
        },
        "metadataChanges": [
            {
                "blockName": "Citation Metadata",
                "changed": [
                    {
                        "fieldName": "Author",
                        "oldValue": "Finch, Fiona; (Birds Inc.)",
                        "newValue": "Finch, Fiona; (Birds Inc.); Poe, Edgar Allen; (Baltimore Poets); Mulligan, Hercules; (Sons of Liberty)"
                    },
                    {
                        "fieldName": "Subject",
                        "oldValue": "Medicine, Health and Life Sciences",
                        "newValue": "Medicine, Health and Life Sciences; Astronomy and Astrophysics; Other"
                    },
                    {
                        "fieldName": "Producer",
                        "oldValue": "",
                        "newValue": "Allen, Irwin; (MGM); Spielberg, Stephen; (ILM)"
                    }
                ]
            },
            {
                "blockName": "Life Sciences Metadata",
                "changed": [
                    {
                        "fieldName": "Design Type",
                        "oldValue": "",
                        "newValue": "Parallel Group Design; Nested Case Control Design"
                    }
                ]
            }
        ],
        "filesAdded": [
            {
                "fileName": "test.tab",
                "filePath": "data/subdir1",
                "MD5": "77c7f03a7d7772907b43f0b322cef723",
                "type": "text/tab-separated-values",
                "fileId": 42,
                "description": "my description",
                "isRestricted": false,
                "categories": [
                    "Data"
                ],
                "tags": [
                    "Survey"
                ]
            }
        ],
        "filesRemoved": [
            {
                "fileName": "dataverseproject_logo.jpg",
                "filePath": "data/subdir1",
                "MD5": "c1edbefa86a55c5037873370ae7fd7b6",
                "type": "image/jpeg",
                "fileId": 40,
                "description": "my description",
                "isRestricted": false,
                "categories": [
                    "Data"
                ]
            }
        ],
        "filesReplaced": [
            {
                "oldFile": {
                    "fileName": "favicon-16x16.png",
                    "filePath": "data/subdir1",
                    "MD5": "d3c852e7ecb92fd105ba4018116a9be8",
                    "type": "image/png",
                    "fileId": 41,
                    "description": "my description",
                    "isRestricted": false,
                    "categories": [
                        "Data"
                    ]
                },
                "newFile": {
                    "fileName": "favicon-32x32.png",
                    "filePath": "data/subdir1",
                    "MD5": "c931f7add8b6a1f9a691046b77c231fa",
                    "type": "image/png",
                    "fileId": 43,
                    "description": "my description",
                    "isRestricted": false,
                    "categories": [
                        "Data"
                    ]
                }
            }
        ],
        "fileChanges": [
            {
                "fileName": "dataverse-icon-1200.png",
                "MD5": "a23eb44803d9127bc6e055f77b869816",
                "fileId": 39,
                "changed": [
                    {
                        "fieldName": "isRestricted",
                        "oldValue": "false",
                        "newValue": "true"
                    }
                ]
            }
        ],
        "TermsOfAccess": {
            "changed": [
                {
                    "fieldName": "Data Access Place",
                    "oldValue": "",
                    "newValue": "Somewhere"
                }
            ]
        }
    }
}
 */

export interface DatasetVersionDiffPayload {
  oldVersion: VersionSummaryPayload
  newVersion: VersionSummaryPayload
  metadataChanges: MetadataBlockDiffPayload[]
  filesAdded: FileSummaryPayload[]
  filesRemoved: FileSummaryPayload[]
  fileChanges: FileDiffPayload[]
  filesReplaced: FileReplacementPayload[]
  TermsOfAccess: FieldDiffPayload[]
}

export interface FileSummaryPayload {
  fileName: string
  MD5: string
  type: string
  fileId: number
  filePath: string
  description: string
  isRestricted: boolean
  tags: string[]
  categories: string[]
}

export interface VersionSummaryPayload {
  versionNumber: string
  lastUpdatedDate: string
}
export interface MetadataBlockDiffPayload {
  blockName: string
  changed: FieldDiffPayload[]
}

export interface FileDiffPayload {
  fileName: string
  md5: string
  fileId: number
  changed: FieldDiffPayload[]
}
export interface FieldDiffPayload {
  fieldName: string
  oldValue: string
  newValue: string
}

export interface FileReplacementPayload {
  oldFile: FileSummaryPayload
  newFile: FileSummaryPayload
}
