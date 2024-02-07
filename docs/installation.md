# Installation

## NPM

### Stable version

A stable 1.x version of this package is available as `js-dataverse` at https://www.npmjs.com/package/js-dataverse

Install the package stable version using npm:

```bash
npm install js-dataverse
```

### Development versions

An unstable 2.x version of this package with breaking changes is under development.

Until a 2.0 version is officially released, it can be installed from https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript

## Initialization

In order for the package to connect to the Dataverse API, there is an `APIConfig` object that should be initialized to set the preferred authentication mechanism with the associated credentials for connecting to the Dataverse API.

Currently, the supported authentication mechanisms are:

- **API Key**: The recommended authentication mechanism. The API Key should correspond to a particular Dataverse user account.

- **Session Cookie**: This is an experimental feature primarily designed for Dataverse SPA development. It is necessary to enable the corresponding feature flag in the Dataverse installation to use this mechanism (See https://guides.dataverse.org/en/latest/installation/config.html?#feature-flags). It is recommended not to use this mechanism and instead use API Key authentication.

It is recommended to globally initialize the `ApiConfig` object from the consuming application, as the configuration will be read on every API call made by the package's use cases.

For example, in a React application, we can globally initialize the `ApiConfig` object in the `App` file, like this:

```typescript
ApiConfig.init(<DATAVERSE_API_BASE_URL>, DataverseApiAuthMechanism.API_KEY, <DATAVERSE_API_KEY>)

function App() {
  /* Yor App code */
}

export default App
```

The same example but with example values set:

```typescript
ApiConfig.init(
  'http://localhost:8000/api/v1',
  DataverseApiAuthMechanism.API_KEY,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
)

function App() {
  /* Yor App code */
}

export default App
```

We can initialize the `ApiConfig` object as an unauthenticated user, by setting `undefined` as the API Key value.

This will allow use cases that do not require authentication to be successfully executed, but those that do require authentication will fail.
