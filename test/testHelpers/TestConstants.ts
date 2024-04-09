import { ROOT_COLLECTION_ALIAS } from '../../src/collections/domain/models/Collection'
import { NewDatasetDTO } from '../../src/datasets/domain/dtos/NewDatasetDTO'

export class TestConstants {
  static readonly TEST_API_URL = 'http://localhost:8080/api/v1'
  static readonly TEST_DUMMY_API_KEY = 'dummyApiKey'
  static readonly TEST_DUMMY_PERSISTENT_ID = 'doi:11.1111/AA1/AA1AAA'
  static readonly TEST_ERROR_RESPONSE = {
    response: {
      status: 'ERROR',
      message: 'test'
    }
  }
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY = {
    params: {},
    headers: {
      'Content-Type': 'application/json',
      'X-Dataverse-Key': TestConstants.TEST_DUMMY_API_KEY
    }
  }
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED = {
    params: { includeDeaccessioned: true },
    headers: {
      'Content-Type': 'application/json',
      'X-Dataverse-Key': TestConstants.TEST_DUMMY_API_KEY
    }
  }
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE = {
    withCredentials: true,
    params: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE_INCLUDE_DEACCESSIONED =
    {
      withCredentials: true,
      params: { includeDeaccessioned: true },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  static readonly TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG = {
    params: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }
  static readonly TEST_CREATED_DATASET_1_ID = 2
  static readonly TEST_CREATED_DATASET_2_ID = 3
  static readonly TEST_CREATED_DATASET_3_ID = 5
  static readonly TEST_CREATED_DATASET_4_ID = 4
  static readonly TEST_DUMMY_COLLECTION_ID = 10001
  static readonly TEST_DUMMY_COLLECTION_ALIAS = 'dummyCollectionId'
  static readonly TEST_CREATED_COLLECTION_1_ID = 5
  static readonly TEST_CREATED_COLLECTION_1_ALIAS = 'testCollection'
  static readonly TEST_CREATED_COLLECTION_ALIAS = 'testCollection'
  static readonly TEST_CREATED_COLLECTION_1_ROOT = ROOT_COLLECTION_ALIAS
  static readonly TEST_NEW_DATASET_DTO: NewDatasetDTO = {
    license: {
      name: 'CC0 1.0',
      uri: 'http://creativecommons.org/publicdomain/zero/1.0',
      iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
    },
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'Dataset created using the createDataset use case',
          author: [
            {
              authorName: 'Admin, Dataverse',
              authorAffiliation: 'Dataverse.org'
            },
            {
              authorName: 'Owner, Dataverse',
              authorAffiliation: 'Dataversedemo.org'
            }
          ],
          datasetContact: [
            {
              datasetContactEmail: 'finch@mailinator.com',
              datasetContactName: 'Finch, Fiona'
            }
          ],
          dsDescription: [
            {
              dsDescriptionValue: 'This is the description of the dataset.'
            }
          ],
          subject: ['Medicine, Health and Life Sciences']
        }
      }
    ]
  }
}
