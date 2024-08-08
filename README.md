# Initialize Bit for CI/CD Pipelines
Initialize Bit for CI/CD Pipelines

# GitHub Actions

This task installs Bit in your CI by executing `bit install` inside the workspace directory.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"./"`.

### `cache`

**Optional** Enables caching for the workflow. Default `"false"`. Available in `bit-tasks/init@v2`.

### `ripple`

**Optional** Use ripple ci to build components. Default `"false"`.

### `docker`

**Optional** Use a docker container to build components. Default `"false"`.

### `lane`

**Optional** Import a specific lane before running `bit install`.

### `log`

**Optional** Log bit CLI execution, options are: `[trace, debug, info, warn, error, fatal]`, Default `"info"`.

## Example usage

1. Create a new [secret variable](https://docs.github.com/en/actions/security-guides/encrypted-secrets) for `BIT_CONFIG_ACCESS_TOKEN`([docs](https://bit.dev/reference/ci/github-actions#generating-an-access-token)) and use it as an [environment variable](https://docs.github.com/en/actions/learn-github-actions/variables) in your GitHub Action.
2. **[Optional]** Create new [secret variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets) `GIT_USER_NAME`, `GIT_USER_EMAIL` and use them as [environment variables](https://docs.github.com/en/actions/learn-github-actions/variables) in your GitHub Action.
3. **[Optional]** Define `GITHUB_TOKEN` as an [environment variable](https://docs.github.com/en/actions/learn-github-actions/variables) only in the workflow yaml file. **Note:** This token is [automatically generated by GitHub Actions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) and is a reserved keyword in GitHub action secrets. Therefore, you don't need to create a separate secret for it.
4. **[Optional]** If your workspace is not at the root of the Git repository, specify the input parameter `ws-dir` pointing to the workspace directory path.

**Note:** `GITHUB_TOKEN`, `GIT_USER_NAME`, and `GIT_USER_EMAIL` are required for tasks like `bit-tasks/commit-bitmap@v1`, `bit-tasks/dependency-update@v1` etc. Therefore, it is **recommended** to define these variables upfront, which makes the workflow configuration consistent and reusable across different `bit-tasks`.

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
      BIT_CONFIG_ACCESS_TOKEN: ${{ secrets.BIT_CONFIG_ACCESS_TOKEN }}
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
          npm config set //node-registry.bit.cloud/:_authToken ${{ env.BIT_CONFIG_ACCESS_TOKEN }}
```

**Note:** For external registries, append a new configuration to the registry config list and configure the authToken if required.

```yaml
  npm config set`@myorg:registry` https://<my-org-registry-url>
  npm config set //<my-org-registry-url>/:_authToken ${{ <MY ORG ACCESS TOKEN> }}
```

## Docker Support
You can use the official bit docker image to execute the `bit-tasks/init@v2` task. This saves the time that used to install bit inside the init task. You need to set `docker: "true"` input parameter for the `bit-tasks/init@v2` task, when running inside a container.

```yaml
name: Test Bit Init with Docker
on:
  workflow_dispatch:
jobs:
  install:
    runs-on: ubuntu-latest
    container:
      image: bitsrc/stable:latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CONFIG_ACCESS_TOKEN: ${{ secrets.BIT_CONFIG_ACCESS_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v2
        with:
          ws-dir: '<WORKSPACE_DIR_PATH>'
          docker: "true"
```

# Contributor Guide

Steps to create custom tasks in different CI/CD platforms.

## GitHub Actions

Go to the GithHub action task directory and build using NCC compiler. For example;

```
npm install
npm run build
git commit -m "Update task"
git tag -a -m "action release" v2 --force
git push --follow-tags
```

For more information, refer to [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
