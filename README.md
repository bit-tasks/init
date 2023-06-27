# Bit Tasks for Git CI/CD Pipelines
Bit tasks for Github Actions, AzureDevOps, GitLab and other CI/CD platforms.

# GitHub Actions

## Example usage

```yaml
- name: Initialize Bit
  uses: bit-tasks/init

```

# Contributor Guide

Steps to create custom tasks in different CI/CD platforms.

## GitHub Actions

Go to the GithHub action task directory and build using NCC compiler. For example;

```
npm i -g @vercel/ncc
ncc build index.js --license licenses.txt
git commit -m "Update task"
git tag -a -m "action release" v1.1
git push --follow-tags
```

For more information refer [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)

## GitLab CI/CD

For more information refer [Specify a custom CI/CD file](https://docs.gitlab.com/ee/ci/pipelines/settings.html#specify-a-custom-cicd-configuration-file)

## Azure DevOps

For more information refer [Add build task](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops)