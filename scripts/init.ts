import * as fs from "fs";
import * as path from "path";
import * as jsoncParser from "jsonc-parser";
import { exec } from "@actions/exec";
import * as core from "@actions/core";

const run = async (wsdir: string, skipDepInstall: boolean, args: string[]) => {
  const wsDirPath = path.resolve(wsdir);
  const wsFile = path.join(wsDirPath, "workspace.jsonc");
  const workspaceFileExist = fs.existsSync(wsFile);
  let bitEngineVersion = "";

  if (workspaceFileExist) {
    const workspace = fs.readFileSync(wsFile).toString();
    // sets org and scope env for dependent tasks usage
    const workspaceObject = jsoncParser.parse(workspace);
    const defaultScope =
      workspaceObject["teambit.workspace/workspace"].defaultScope;
    const [Org, Scope] = defaultScope.split(".");
    process.env.ORG = Org;
    process.env.SCOPE = Scope;

    // get bitEngineVersion from workspace.jsonc
    bitEngineVersion = workspaceObject["teambit.harmony/bit"]?.engine || "";
  } else {
    // Log a warning if workspace.jsonc is missing
    core.warning(
      "WARNING - Cannot find the workspace.jsonc file. This will skip initializing ORG and SCOPE environment variables and may affect subsequent tasks!"
    );
  }

  // get installed bit version
  let installedBitVersion = "";
  try {
    await exec("bit", ["-v"], {
      listeners: {
        stdout: (data: Buffer) => {
          installedBitVersion += data.toString();
        },
      },
    });
    installedBitVersion = installedBitVersion.trim();
    core.info(
      `Bit version ${installedBitVersion} is available on the build agent.`
    );
  } catch (error) {
    installedBitVersion = "";
  }

  // check if installation is needed
  const shouldInstallBitCLI =
    !installedBitVersion ||
    (bitEngineVersion && bitEngineVersion !== installedBitVersion);

  if (shouldInstallBitCLI) {
    if (
      installedBitVersion &&
      bitEngineVersion &&
      bitEngineVersion !== installedBitVersion
    ) {
      core.warning(
        `WARNING - Bit version ${installedBitVersion} is already installed, however workspace requires the version ${bitEngineVersion}. Installing version ${bitEngineVersion}. This may increase the overall build time.`
      );
    }
    await exec("npm", ["i", "-g", "@teambit/bvm"]);
    await exec("bvm", ["install", bitEngineVersion, "--use-system-node"]);
  }

  // sets path for current step
  process.env.PATH = `${process.env.HOME}/bin:` + process.env.PATH;

  // config bit/npm for CI/CD
  process.env.BIT_CONFIG_ANALYTICS_REPORTING = "false";
  process.env.BIT_CONFIG_ANONYMOUS_REPORTING = "false";
  process.env.BIT_CONFIG_INTERACTIVE = "false";
  process.env.BIT_DISABLE_CONSOLE = "true";
  process.env.BIT_DISABLE_SPINNER = "true";

  // bit install dependencies
  if (workspaceFileExist && !skipDepInstall) {
    await exec("bit", ["install", ...args], { cwd: wsdir });
  } else {
    core.warning(`WARNING - Skipped running 'bit install' command`);
  }
};

export default run;
