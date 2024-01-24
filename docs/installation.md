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

- API Key: The recommended mechanism and the original one from the initial package versions. The API Key should correspond to a particular Dataverse user.

- Session Cookie: This is an experimental feature primarily designed for Dataverse SPA development. It is necessary to enable the corresponding feature flag in the Dataverse installation (See https://guides.dataverse.org/en/latest/installation/config.html?#feature-flags). It is recommended not to use this mechanism.

TODO