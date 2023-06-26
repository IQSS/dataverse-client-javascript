# dataverse-client-javascript

[![npm](https://img.shields.io/npm/v/js-dataverse.svg)](https://www.npmjs.com/package/js-dataverse)

A JavaScript/TypeScript API wrapper for [Dataverse](http://guides.dataverse.org/en/latest/api/).

## NPM

A stable 1.x version of this package is available as `js-dataverse` at https://www.npmjs.com/package/js-dataverse

An unstable 2.x version of this package with breaking changes is under development. Until a 2.0 version is officially released, it can be installed from https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript

## Getting Started

This package is built using `node v19`, so it is recommended to use that version.

Make sure that you install all the project dependencies:

`npm install`

## Build project

In order to build the project, we need to run the following command:

`npm run build`

the build generated will be placed in `dist` folder.

## Tests

### Run all tests

`npm run test`

### Run unit tests

`npm run test:unit`

### Run integration tests

`npm run test:integration`

#### Configure the integration testing environment

The integration testing environment is implemented with Test Containers and Docker Compose. The environment uses different environment variables, defined in a .env file, available in the _test/integration/environment_ folder.

These environment variables can be updated as needed for integration testing. For example, we can specify the image tag, corresponding to the Dataverse branch to test, through the DATAVERSE_BRANCH_NAME variable.

### Run test coverage

`npm run test:coverage`

## Format and lint

### Run formatter

`npm run format`

### Run linter

Running a linting check on the code:

`npm run lint`

Fix linting checks on the code:

`npm run lint:fix`

## Publishing new version

Automated publishing of versions could be automated when merging to master. Below are the steps that would be required to publish a new version:

1. Run tests and checks
2. Build the project
3. Commit changes
4. Upgrade npm version
5. Publish, `npm publish`

## Contributing

We love contributors! Please see [CONTRIBUTING.md](CONTRIBUTING.md).
