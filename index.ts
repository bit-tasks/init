import * as fs from "fs";
import * as core from "@actions/core";
import run from "./scripts/init";

try {
  const wsDir: string = core.getInput("ws-dir");
  const bitToken = process.env.BIT_TOKEN;
  if (!bitToken) {
    throw new Error("Bit token not found");
  }

  run(bitToken, wsDir).then((): void => {
    // Set wsDir env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `WSDIR=${process.env.WSDIR}\n`
    );
    // Set Bit path for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_PATH as string,
      process.env.PATH as string
    );
    // Set org env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `ORG=${process.env.ORG}\n`
    );
    // Set scope env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `SCOPE=${process.env.SCOPE}\n`
    );
    // Set Bit analytics reporting env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_CONFIG_ANALYTICS_REPORTING=${process.env.BIT_CONFIG_ANALYTICS_REPORTING}\n`
    );
    // Set Bit anonymous reporting env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_CONFIG_ANONYMOUS_REPORTING=${process.env.BIT_CONFIG_ANONYMOUS_REPORTING}\n`
    );
    // Set Bit interactive env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_CONFIG_INTERACTIVE=${process.env.BIT_CONFIG_INTERACTIVE}\n`
    );
    // Set Bit user token env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_CONFIG_USER_TOKEN=${process.env.BIT_CONFIG_USER_TOKEN}\n`
    );
  });
} catch (error: any) {
  core.setFailed(error.message);
}
