import { FilePreviewChecksumPayload } from '../../../../../src/files/infra/repositories/transformers/FilePreviewPayload'

export interface MyDataFilePreviewPayload {
  name: string
  type: string
  url: string
  file_id: string
  file_type: string
  file_content_type: string
  size_in_bytes: number
  md5: string
  checksum: FilePreviewChecksumPayload
  unf: string
  dataset_name: string
  dataset_id: string
  dataset_persistent_id: string
  dataset_citation: string
  restricted: boolean
  canDownloadFile: boolean
  matches: string[]
  score: number
  entity_id: number
  publicationStatuses: string[]
  releaseOrCreateDate: string
  is_draft_state: boolean
  is_in_review_state: boolean
  is_unpublished_state: boolean
  is_published: boolean
  is_deaccesioned: boolean
  is_valid: boolean
  date_to_display_on_card: string
  parentIdentifier: string
  parentName: string
  user_roles: string[]
  image_url?: string
  variables?: number
  observations?: number
  file_persistent_id?: string
  description?: string
}
/*
{
    "name": "teacher_survey.tab",
    "type": "file",
    "url": "http://localhost:8080/api/access/datafile/15",
    "file_id": "15",
    "file_type": "Comma Separated Values",
    "file_content_type": "text/comma-separated-values",
    "size_in_bytes": 174644,
    "md5": "1db96dd4229c5bf5e6d8b1e6a301dca0",
    "checksum": {
        "type": "MD5",
        "value": "1db96dd4229c5bf5e6d8b1e6a301dca0"
    },
    "unf": "UNF:6:2Q0xnmkmgp6vi/lAa+bhRQ==",
    "dataset_name": "Never Published",
    "dataset_id": "14",
    "dataset_persistent_id": "doi:10.5072/FK2/IHYE1J",
    "dataset_citation": "Admin, Dataverse, 2025, \"Never Published\", https://doi.org/10.5072/FK2/IHYE1J, Root, DRAFT VERSION, UNF:6:2Q0xnmkmgp6vi/lAa+bhRQ== [fileUNF]",
    "restricted": false,
    "variables": 10,
    "observations": 7000,
    "canDownloadFile": true,
    "matches": [],
    "score": 321.1235656738281,
    "entity_id": 15,
    "publicationStatuses": [
        "Unpublished",
        "Draft"
    ],
    "releaseOrCreateDate": "2025-04-23T13:48:15Z",
    "publication_statuses": [
        "Unpublished",
        "Draft"
    ],
    "is_draft_state": true,
    "is_in_review_state": false,
    "is_unpublished_state": true,
    "is_published": false,
    "is_deaccesioned": false,
    "is_valid": true,
    "date_to_display_on_card": "Apr 23, 2025",
    "parentIdentifier": "doi:10.5072/FK2/IHYE1J",
    "parentName": "Never Published",
    "user_roles": [
        "Admin",
        "Contributor"
    ]
}
*/
