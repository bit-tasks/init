import * as fs from "fs";
import * as core from "@actions/core";
import run from "./scripts/init";

try {
  const wsDir: string | undefined = process.env.WS_DIR;

  if (!wsDir) {
    throw new Error("Workspace directory is not set");
  }
  
  process.env.RIPPLE = core.getInput("ripple-ci");

  const debugFlag =  core.getInput("debug") === "true"? '--debug': '';
  process.env.DEBUG_FLAG = debugFlag;

  if (!process.env.BIT_CONFIG_ACCESS_TOKEN && !process.env.BIT_CONFIG_USER_TOKEN) {
    // Keeping backward compatibility for BIT_CONFIG_USER_TOKEN
    throw new Error("BIT_CONFIG_ACCESS_TOKEN environment variable is not set!");
  } else if(!process.env.BIT_CONFIG_USER_TOKEN){
    process.env.BIT_CONFIG_USER_TOKEN = process.env.BIT_CONFIG_ACCESS_TOKEN;
  }

  run(wsDir, debugFlag).then((): void => {
    // Set WSDIR env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `WSDIR=${process.env.WSDIR}\n`
    );
    // Set RIPPLE env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `RIPPLE=${process.env.RIPPLE}\n`
    );
    // Set DEBUG_FLAG env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `DEBUG_FLAG=${process.env.DEBUG_FLAG}\n`
    );
    // Set Bit path for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_PATH as string,
      process.env.PATH as string
    );
    // Set BIT_CONFIG_USER_TOKEN env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_CONFIG_USER_TOKEN=${process.env.BIT_CONFIG_USER_TOKEN}\n`
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
    // Set Bit console env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_DISABLE_CONSOLE=${process.env.BIT_DISABLE_CONSOLE}\n`
    );
    // Set Bit spinner env for subsequent steps in GitHub Actions
    fs.appendFileSync(
      process.env.GITHUB_ENV as string,
      `BIT_DISABLE_SPINNER=${process.env.BIT_DISABLE_SPINNER}\n`
    );
  });
} catch (error: any) {
  core.setFailed(error.message);
}
