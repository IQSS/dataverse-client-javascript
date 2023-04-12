# dataverse-client-javascript

[![npm](https://img.shields.io/npm/v/js-dataverse.svg)](https://www.npmjs.com/package/js-dataverse)

A JavaScript/TypeScript API wrapper for [Dataverse](http://guides.dataverse.org/en/latest/api/).

This package is built using `node v19`.

## NPM

Module available as `js-dataverse` at https://www.npmjs.com/package/js-dataverse

## Build project

In order to build the project, we need to run the following command:

`npm run build`

the build generated will be placed in `dist` folder.

## Tests

### Pre-requisites

Make sure that you install all the project dependencies

`npm install`

### Run all tests

`npm run test`

### Run unit tests

`npm run test:unit`

### Run integration tests

`npm run test:integration`

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

[If you are interested in contributing, please click here](/CONTRIBUTING.md)
