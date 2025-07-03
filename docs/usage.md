## Initialization

In order for the package to connect to the Dataverse API, there is an `APIConfig` object that should be initialized to set the preferred authentication mechanism with the associated credentials for connecting to the Dataverse API.

Currently, the supported authentication mechanisms are:

- **API Key**: The recommended authentication mechanism. The API Key should correspond to a particular Dataverse user account.

- **Bearer Token**: This mechanism is currently under development and testing. We've selected it for the upcoming Dataverse SPA and will provide more information in a future release once it becomes a standard.

- **Session Cookie**: This is an experimental feature primarily designed for Dataverse SPA development. To use this mechanism, you must enable the corresponding feature flag in the Dataverse installation (See https://guides.dataverse.org/en/latest/installation/config.html?#feature-flags). It is recommended not to use this mechanism and instead use API Key authentication.

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
