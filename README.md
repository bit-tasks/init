# Initialize Bit for CI/CD Pipelines
Initialize Bit for CI/CD Pipelines

# GitHub Actions

This CI Task, install bit in the CI and executs `bit install` inside the workspace directory.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"./"`.

## Example usage

Create a new [secret variable](https://docs.github.com/en/actions/security-guides/encrypted-secrets) in your Github repository. Name it `BIT_TOKEN`.

```yaml
name: Test Bit Init
on:
  workflow_dispatch:
jobs:
  release:
    runs-on: ubuntu-latest
    env:
      BIT_TOKEN: ${{ secrets.BIT_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
          ws-dir: '<WORKSPACE_DIR_PATH>'
```

# Contributor Guide

Steps to create custom tasks in different CI/CD platforms.

## GitHub Actions

Go to the GithHub action task directory and build using NCC compiler. For example;

```
npm install
npm run build
git commit -m "Update task"
git tag -a -m "action release" v1 --force
git push --follow-tags
```

For more information refer [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
