import * as fs from "fs";
import * as core from "@actions/core";
import run from "./scripts/init";

try {
  const wsDir: string = core.getInput("ws-dir");
  run(wsDir);
  // Set wsDir path for subsequent steps in GitHub Actions
  fs.appendFileSync(
    process.env.GITHUB_ENV as string,
    `WSDIR="${process.env.WSDIR}"`
  );
  // Set Bit path for subsequent steps in GitHub Actions
  fs.appendFileSync(
    process.env.GITHUB_PATH as string,
    process.env.PATH as string
  );
} catch (error: any) {
  core.setFailed(error.message);
}
