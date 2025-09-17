# Contributing to dataverse-client-javascript

First of all thank you very much for your interest in contributing to this project!

## Getting started

1. Fork the repository and clone your fork locally
2. Follow the [Local Development](./docs/localDevelopment.md) guide for setting up your local development environment
3. Create a branch and apply the desired changes on it
4. Create a pull request from your fork branch targeting the develop branch of the root repository

## Checklist before creating PR

- Project builds
- Lint and format checks pass
- Unit and integration tests pass
- Unit and integration tests for new functionality/fix are added
- Documentation is updated (Any new use case added or modified should be documented in the [Use Cases](./docs/useCases.md) section)
- Changelog is updated with your changes in the `[Unreleased]` section of [CHANGELOG.md](./CHANGELOG.md)

## Maintaining the Changelog

When contributing to this project, it's important to document your changes in the changelog to help users and developers understand what has been added, changed, fixed, or removed between versions. The changelog helps maintain transparency about project evolution and assists users in understanding the impact of updates. We also have another changelog for design system, so for any design system changes, please include them in that changelog.

### When to Add Changelog Entries

**Every pull request should include a changelog entry**

Add a changelog entry for changes, including:

- **Added**: New features, components, or functionality
- **Changed**: Changes to existing functionality, API modifications, or package updates
- **Fixed**: Bug fixes and issue resolutions
- **Removed**: Deprecated features or removed functionality

### How to Add Changelog Entries

1. **Add your changes to the `[Unreleased]` section** at the top of `CHANGELOG.md`
2. **Categorize your changes** under the appropriate category(Added, Changed, Fixed, Removed)
3. **Write clear, concise descriptions** that help users understand the impact of changes
4. **Include relevant issue numbers** when applicable

## Code of Conduct

We abide by the upstream Code of Conduct at https://github.com/IQSS/dataverse/blob/develop/CODE_OF_CONDUCT.md and in addition ask the following.

### Git

- Branch names are self descriptive
- Commit messages are short and concise
- Branch is put up to date before creating PR

### Our responsibilities

- To keep the code clean
- To provide constructive feedback to other developers
- To maintain readable code at all times

## Getting help

Please, do not hesitate to contact us through:

- Zulip: https://dataverse.zulipchat.com/#narrow/stream/410361-ui-dev
- Google Group: https://groups.google.com/g/dataverse-dev
