# dataverse-client-javascript

[![npm](https://img.shields.io/npm/v/js-dataverse.svg)](https://www.npmjs.com/package/js-dataverse)

A JavaScript/TypeScript client for [Dataverse](http://guides.dataverse.org/en/latest/api/).

## NPM

Module available as `js-dataverse` at https://www.npmjs.com/package/js-dataverse

## Build project

In order to build the project, we need to run the following command:

`yarn build` or `npm run build`

the build generated will be placed in `dist` folder.

## Tests

### Pre-requisites

Make sure that you install all the project dependencies

`yarn install` or `npm install`

Keep consistent, whether you use yarn or npm

### Run all tests

`yarn test` or `npm run test`

### Run unit tests

`yarn test:unit` or `npm run test:unit`

### Run integration tests

`yarn test:integration` or `npm run test:integration`

### Run test coverage

`yarn test:coverage` or `npm run test:coverage`

## Format and lint

### Run formatter

`yarn format` or `npm run format`

### Run linter

Running a linting check on the code:

`yarn lint` or `npm run lint`

Fix linting checks on the code:

`yarn lint:fix` or `npm run lint:fix`

## Publishing new version

Automated publishing of versions could be automated when merging to master. Below are the steps that would be required to publish a new version:

1. Run tests and checks
2. Build the project
3. Commit changes
4. Upgrade npm version
5. Publish, `npm publish`

## Contributing

[If you are interested in contributing, please click here](/CONTRIBUTING.md)
