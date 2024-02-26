export class TestConstants {
  static readonly TEST_API_URL = 'http://localhost:8080/api/v1';
  static readonly TEST_DUMMY_API_KEY = 'dummyApiKey';
  static readonly TEST_DUMMY_PERSISTENT_ID = 'doi:11.1111/AA1/AA1AAA';
  static readonly TEST_ERROR_RESPONSE = {
    response: {
      status: 'ERROR',
      message: 'test',
    },
  };
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY = {
    params: {},
    headers: {
      'Content-Type': 'application/json',
      'X-Dataverse-Key': TestConstants.TEST_DUMMY_API_KEY,
    },
  };
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED = {
    params: { includeDeaccessioned: true },
    headers: {
      'Content-Type': 'application/json',
      'X-Dataverse-Key': TestConstants.TEST_DUMMY_API_KEY,
    },
  };
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE = {
    withCredentials: true,
    params: {},
    headers: {
      'Content-Type': 'application/json',
    },
  };
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE_INCLUDE_DEACCESSIONED = {
    withCredentials: true,
    params: { includeDeaccessioned: true },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  static readonly TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG = {
    params: {},
    headers: {
      'Content-Type': 'application/json',
    },
  };
  static readonly TEST_CREATED_DATASET_1_ID = 2;
  static readonly TEST_CREATED_DATASET_2_ID = 3;
  static readonly TEST_CREATED_DATASET_3_ID = 4;
}
