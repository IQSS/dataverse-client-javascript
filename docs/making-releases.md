# Making Releases

- [Introduction](#introduction)
- [Regular or Hotfix?](#regular-or-hotfix)
- [Github and Git steps](#github-and-git-steps)
- [Run Tests](#run-tests)
- [Publish the Dataverse Client Javascript package](#publish-the-dataverse-client-javascript-package)
- [Merge "release branch" into "main"](#merge-release-branch-into-main)
- [Merge "main" into "develop"](#merge-main-into-develop)

## Introduction

This document is about releasing a public version of the dataverse-client-javascript package to the npm registry.

## Regular or Hotfix?

Early on, make sure it’s clear what type of release this is. The steps below describe making both regular releases and hotfix releases. Suppose the current version is 1.0.0.

- Regular
  - e.g. 1.1.0 (minor)
  - e.g. 2.0.0 (major)
- Hotfix
  - e.g. 1.1.1 (patch)

## Github and Git steps

First of all create an issue on Github to prepare the release, name it Release vX.X.X .

On your local, create the release branch from the latest from develop and name it release/X.X.X .

## Run Tests

Let's check that all tests are passing by running `npm run test`. If everything is OK you can continue with the next step.

## Publish the Dataverse Client Javascript package

Dataverse Client Javascript is [published](https://www.npmjs.com/package/@iqss/dataverse-client-javascript) to the npm Package Registry. Below are the steps for publishing a new version.

1.  **Build the package**

    Now we need to build the package by running `npm run build`, after that you will see a `dist` folder in the root of the project. If you are not sure that folder was there already you can delete it and run the build command again.

2.  **Update the version**

    To update the version run the command `npm version <X.X.X> -m "dataverse-client-javascript-v%s"`. So if we are releasing version `3.5.0` the command will be:

    ```shell
    npm version 3.5.0 -m "dataverse-client-javascript-v%s"
    ```

    This command will update the version in the `package.json` and `package-lock.json`, create a commit and a tag named `dataverse-client-javascript-v3.5.0`.

    If everything looks good, you can push the changes to the repository.

    ```shell
    git push && git push --tags
    ```

3.  **Review the new tag in GitHub**

    After pushing the changes, you can review the new tag in the [GitHub repository](https://github.com/IQSS/dataverse-client-javascript/tags).

    The tag should be created with the new version.

4.  **Publish the package**

    After the version is updated, you can publish the package running the next command:

    ```shell
    npm publish --access public
    ```

    This command will publish the package to the npm registry.

    Remember that you need a valid npm token to publish the package and be part of the @iqss organization on npm.

    Get a new token from the npm website and update the `.npmrc` file with the new token. If you don't have yet an `.npmrc` file, go to the project directory root, duplicate `.npmrc.example`, saving the copy as `.npmrc`.

    Open the `.npmrc` file and replace `YOUR_NPM_TOKEN ` with your actual npm token.

    ```plaintext
    //registry.npmjs.org/:\_authToken=<YOUR_NPM_AUTH_TOKEN>
    @iqss:registry=https://registry.npmjs.org/
    ```

5.  **Review the new version in the npm registry**

    After publishing the package, you can review the new version in the [npm registry](https://www.npmjs.com/package/@iqss/dataverse-client-javascript?activeTab=versions).

    The new version should be available in the npm registry.

## Merge "release branch" into "main"

Create a pull request to merge the `release` branch into the `main` branch.
Once important tests have passed (unit, functional, integration), merge the pull request (skipping code review is ok).

## Merge "main" into "develop"

After merging the release branch into `main`, ensure the develop branch is updated with the latest changes.

Create a pull request to merge the `main` branch into `develop` branch.
