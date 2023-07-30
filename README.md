# Initialize Bit for CI/CD Pipelines
Initialize Bit for CI/CD Pipelines

# GitHub Actions

This task installs Bit in your CI by executing `bit install` inside the workspace directory.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"./"`.

## Example usage

1. Create a new [secret variable](https://docs.github.com/en/actions/security-guides/encrypted-secrets) in your GitHub repository. Name it `BIT_CONFIG_USER_TOKEN`.
2. **[Optional]** Create [secret variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets) `GIT_USER_NAME` and `GIT_USER_EMAIL` and use them as [environment variables](https://docs.github.com/en/actions/learn-github-actions/variables) in your GitHub Action.
3. **[Optional]** Use `GITHUB_TOKEN` as an environment variable. Here, `GITHUB_TOKEN` secret is [automatically created by GitHub Actions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication).

**Note:** `GITHUB_TOKEN`, `GIT_USER_NAME`, and `GIT_USER_EMAIL` are required for tasks like `bit-tasks/commit-bitmap@v1`, `bit-tasks/dependency-update@v1` etc. Therefore, defining these variables upfront will make the workflow configuration consistent and reusable across different `bit-tasks`.

```yaml
name: Test Bit Init
on:
  workflow_dispatch:
jobs:
  install:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CONFIG_USER_TOKEN: ${{ secrets.BIT_CONFIG_USER_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
          ws-dir: '<WORKSPACE_DIR_PATH>'
```

## Resolve component packages 

Use the below step to resolve component packages from **bit.cloud** registry.
```yaml
      - name: Resolve component packages from bit.cloud registry (Mandatory for component installation using package managers other than Bit)
        run: |
          npm config set '@bit:registry' https://node-registry.bit.cloud
          npm config set '@teambit:registry' https://node-registry.bit.cloud
          npm config set //node-registry.bit.cloud/:_authToken ${{ env.BIT_CONFIG_USER_TOKEN }}
```

**Note:** For external registries, append a new configuration to the registry config list and configure the authToken if required.

```yaml
  npm config set`@myorg:registry` https://<my-org-registry-url>
  npm config set //<my-org-registry-url>/:_authToken ${{ <MY ORG ACCESS TOKEN> }}
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

For more information, refer to [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
