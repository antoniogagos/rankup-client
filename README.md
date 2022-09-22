<figure align="center">
  <img width="160" src="./packages/app/assets/icons/rk-logo.svg"></img>
  <figcaption><h1 style="margin-top: -10px">Rankup</h1></figcaption>
</figure>

- [Overview](#overview)
- [Development](#development)
  - [Branch name format](#branch-name-format)
  - [Commit message format](#commit-message-format)
  - [Common workspace](#common-workspace)
  - [Breaking changes](#breaking-changes)
  - [Creating a new package](#creating-a-new-package)
  - [Global commands](#global-commands)

# Overview

This is a monorepo contains several packages/[workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/) under `/packages` folder.

| Directory      | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| app            | App shell                                                                    |
| common         | Contains common assets, libraries, and type definitions                      |
| eslint-plugin  | Adds some important rules for our monorepo                                   |
| samba          | Our design system                                                            |
| authentication | Authenticated pages                                                          |
| \*             | Other front ends that can add routes to the main apps (games, lobby, ...etc) |

# Development

## Branch name format

`feat/<github issue number>-<kebab-case-name>`

Example:

```Example
  feat/12-lobby-mockup
```

## Commit message format

The format should follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
The project convention is a bit stricter and should match `^(feat|fix|chore|test|docs|ci|refactor)(\(\S+\))?\!?:.*(\(#[0-9]+\))` regular expression
The message should contain reference to the related github issue at the end in parenthesis.

```
git commit -m "feat: adds second screen of the user journey (#1)"
```

## Breaking changes

Unlike multi repo micro-services, we don't have package versioning.

When a breaking change occurs on any package, the PR must include fixing any usages in other packages and wait for PR approvals of all CODEOWNERS for those packages changed.

## Global commands

#### Install dependencies

From the project root

```
yarn install
```

#### Build production (optimized) app version

```
yarn build
```

#### Launch development app server

```
yarn start
```

#### Launch development app server

Runs tsc on the app and eslint for everything

```
yarn validate
```

### Creating a new package

There is a script that'll help creating a new package. It uses a blueprint at `/.scripts/package-blueprint`

```
yarn create-package
```

## Creating a new package

Use the command [Creating a new package](#creating-a-new-package)

After the package is created, you have to use the `yarn install` command at the root (packages are just symlinks on the node_modules folder, and yarn install will create them)
