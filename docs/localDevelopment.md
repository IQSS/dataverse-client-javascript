# Local Development

To set up your local development environment for working on this project, follow these steps:

## Prerequisites

### Node.js and npm

Make sure you have Node.js and npm installed on your machine.

This package is built using `node v19`, so it is recommended to use that version.

### Docker and Docker Compose

We use [Test Containers](https://github.com/testcontainers/testcontainers-node) for running integration tests.

In our Test Containers setup we use Docker Compose, as our tests involve multiple containers that need to be orchestrated together.

If you want to run integration tests, you need Docker and Docker Compose installed on your machine.

## Install Dependencies

Make sure that you install all the project dependencies:

```bash
npm install
```

## Build

In order to build the project, we need to run the following command:

```bash
npm run build
```

the build generated will be placed in `dist` folder.

## Tests

### Run all tests

```bash
npm run test
```

### Run unit tests

```bash
npm run test:unit
```

### Run integration tests

```bash
npm run test:integration
```

#### Configure the integration testing environment

The integration testing environment uses different environment variables, defined in a .env file, available in the _test/integration/environment_ folder.

These environment variables can be updated as needed for integration testing. For example, we can specify the Dataverse image registry and tag, to point to the particular Dataverse image to test.

- To test images generated in Dataverse PRs: Set `ghcr.io` as the image registry (DATAVERSE_IMAGE_REGISTRY) and the source branch name of a particular PR as the image tag (DATAVERSE_IMAGE_TAG).

- To test the Dataverse develop branch: Set `docker.io` as the image registry (DATAVERSE_IMAGE_REGISTRY) and `unstable` as the image tag (DATAVERSE_IMAGE_TAG).

### Run test coverage

```bash
npm run test:coverage
```

## Format and lint

### Run formatter

```bash
npm run format
```

### Run linter

Running a linting check on the code:

```bash
npm run lint
```

Fix linting checks on the code:

```bash
npm run lint:fix
```