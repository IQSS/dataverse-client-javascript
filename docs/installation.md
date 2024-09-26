# Installation

Recommended versions node >=16 and npm >=8.

## Getting Started with the Stable Version

A stable 1.x version of this package is available as `js-dataverse` at https://www.npmjs.com/package/js-dataverse

Install the package stable version using npm:

```bash
npm install js-dataverse
```

## Getting Started with the Development Version

An unstable 2.x version of this package with breaking changes is under development.

Until a 2.0 version is officially released, it can be installed from https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript

Two different versions are being pushed to the GitHub Packages registry:

1. **PR-Generated Versions**:

   - These versions are generated from pull request commits.
   - They follow the structure `2.0.0-pr<pr_number>.<commit_hash>`, where `pr_number` is the number of the pull request, and `commit_hash` is the specific commit hash from the PR branch.
   - These versions are unstable and correspond to the state of the package during the pull request.

2. **Develop Alpha Versions**:
   - These versions are generated on every commit made to the `develop` branch, ideally after each pull request is merged.
   - They follow the structure `2.0.0-alpha.<number>`, where `number` is an incremental value that starts at 1 and increases with each build.
   - These versions are also unstable and represent the latest work in progress on the `develop` branch.

### Create a `.npmrc` file and add a token

To install the [@iqss/dataverse-client-javascript](https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript)
from the GitHub registry, follow these steps to create an `.npmrc` file in the root of your project using your GitHub token.

1. **Create `.npmrc`** in your project's root directory.

   ```bash
   touch .npmrc
   ```

2. **Replace the Token**

   Open the newly created `.npmrc` file and replace `YOUR_GITHUB_TOKEN` with your actual GitHub token.

   ```plaintext
   legacy-peer-deps=true

    //npm.pkg.github.com/:_authToken=<YOUR_GITHUB_AUTH_TOKEN>
    @iqss:registry=https://npm.pkg.github.com/
   ```

#### How to Get a GitHub Token

If you don't have a GitHub token yet, follow these steps:

1. Go to your GitHub account settings.

2. Navigate to "Developer settings" -> "Personal access tokens."

3. Click "Personal access tokens" -> "Tokens (classic)" -> "Generate new token (classic)".

4. Give the token a name and select the "read:packages" scope.

5. Copy the generated token.

6. Replace `YOUR_GITHUB_AUTH_TOKEN` in the `.npmrc` file with the copied token.

Now, you should be able to install the Dataverse JavaScript client using npm.

### Install the package

Install the package development version using npm:

```bash
npm install @iqss/dataverse-client-javascript
```

## Initialization

In order for the package to connect to the Dataverse API, there is an `APIConfig` object that should be initialized to set the preferred authentication mechanism with the associated credentials for connecting to the Dataverse API.

Currently, the supported authentication mechanisms are:

- **API Key**: The recommended authentication mechanism. The API Key should correspond to a particular Dataverse user account.

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
