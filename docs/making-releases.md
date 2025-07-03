# Making Releases

- [Introduction](#introduction)
- [Regular or Hotfix?](#regular-or-hotfix)
- [Create Github Issue and Release Branch](#create-github-issue-and-release-branch)
- [Update the version](#update-the-version)
- [Merge "release branch" into "main"](#merge-release-branch-into-main)
- [Publish the Dataverse Client Javascript package](#publish-the-dataverse-client-javascript-package)
- [Create a Draft Release on GitHub and Tag the Version](#create-a-draft-release-on-github-and-tag-the-version)
- [Merge "release branch" into "develop"](#merge-release-branch-into-develop)
- [Delete "release branch"](#delete-release-branch)

## Introduction

This document is about releasing a new version of dataverse-client-javascript.

## Regular or Hotfix?

Early on, make sure it’s clear what type of release this is. The steps below describe making both regular releases and hotfix releases. Suppose the current version is 1.0.0.

- Regular
  - e.g. 1.1.0 (minor)
  - e.g. 2.0.0 (major)
- Hotfix
  - e.g. 1.1.1 (patch)

## Create Github Issue and Release Branch

First of all create an issue on Github to prepare the release, name it Release vX.X.X .

On your local, create the release branch from the latest from develop and name it release/X.X.X .

## Update the version

To update the version run the command `npm version <X.X.X> --no-git-tag-version`. So if we are releasing version `3.5.0` the command will be:

```shell
npm version 3.5.0 --no-git-tag-version
```

This command will update the version in the `package.json` and `package-lock.json`.

If everything looks good, you can push the changes to the repository.

## Merge "release branch" into "main"

Create a pull request to merge the `release` branch into the `main` branch.
Once important tests have passed (unit, functional, integration), merge the pull request (skipping code review is ok).

## Publish the Dataverse Client Javascript package

Once the release branch has been merged, switch to the `main` branch on your local machine and update it to ensure you have the latest changes.

Dataverse Client Javascript is [published](https://www.npmjs.com/package/@iqss/dataverse-client-javascript) to the npm Package Registry. Below are the steps for publishing a new version.

1.  **Build the package**

    Now we need to build the package by running `npm run build`, after that you will see a `dist` folder in the root of the project. If you are not sure that folder was there already you can delete it and run the build command again.

2.  **Publish the package**

    As the version number is already updated and we build the package, now we can publish the package running the next command:

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

3.  **Review the new version in the npm registry**

    After publishing the package, you can review the new version in the [npm registry](https://www.npmjs.com/package/@iqss/dataverse-client-javascript?activeTab=versions).

    The new version should be available in the npm registry.

## Create a Draft Release on GitHub and Tag the Version

After merging the `release` branch into the `main` branch, you should create a release on GitHub and tag the version.

Go to https://github.com/IQSS/dataverse-client-javascript/releases/new to start creating a draft release.

- Under "Choose a tag" you will be creating a new tag. Have it start with a "v" such as v3.5.0. Click "Create new tag on publish".

- Under "Target", choose "main".

- Under "Release title" use the same name as the tag such as v3.5.0.

- Add a description of the changes included in this release. You should include a link to the recently published npm version and summarize the key updates, fixes, or features.

- Click "Save draft" because we do not want to publish the release yet.

At this point you can send around the draft release for any final feedback. Make corrections to the draft, if necessary. Publish once everything is ok.

## Merge "release branch" into "develop"

After merging the release branch into `main`, ensure the develop branch is updated with the latest changes.

Create a pull request to merge the `release` branch into `develop` branch also.

## Delete "release branch"

Once the release process is complete and the `release` branch has been merged into both `main` and `develop`, you can safely delete the `release` branch to keep the repository clean.

- Delete the branch locally from your repository.
- Delete the branch remotely from the remote repository.

This ensures that the `release` branch is no longer present in either your local or remote repositories.
