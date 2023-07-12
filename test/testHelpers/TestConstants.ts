export class TestConstants {
  static readonly TEST_API_URL = 'http://localhost:8080/api/v1';
  static readonly TEST_DUMMY_API_KEY = 'dummyApiKey';
  static readonly TEST_ERROR_RESPONSE = {
    response: {
      status: 'ERROR',
      message: 'test',
    },
  };
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY = {
    headers: {
      'Content-Type': 'application/json',
      'X-Dataverse-Key': TestConstants.TEST_DUMMY_API_KEY,
    },
  };
  static readonly TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  static readonly TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
