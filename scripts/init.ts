import * as fs from 'fs';
import * as path from 'path';
import { exec } from '@actions/exec';

function removeSchemeUrl(inputString: string): string {
  const urlRegex: RegExp = /(https?:\/\/[^\s]+)/g;
  return inputString.replace(urlRegex, '",');
}

function removeComments(jsonc: string): string {
  return jsonc.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
}

const run: (bitToken: string, wsdir: string) => Promise<void> = async (bitToken, wsdir) => {
  // get bit version to install
  const wsDirPath = path.resolve(wsdir);
  // sets wsdir env for any external usage
  process.env.WSDIR = wsdir;

  const wsFile = path.join(wsDirPath, "workspace.jsonc");
  const workspace = fs.readFileSync(wsFile).toString();

  const workspaceJson = removeComments(removeSchemeUrl(workspace));
  const workspaceObject = JSON.parse(workspaceJson);
  const defaultScope = workspaceObject['teambit.workspace/workspace'].defaultScope;
  const [Org, Scope ] = defaultScope.split(".");
  process.env.ORG = Org
  process.env.SCOPE = Scope

  await exec("npx @teambit/bvm install");
  process.env.PATH = `${process.env.HOME}/bin:` + process.env.PATH;

  // config bit/npm for CI/CD
  process.env.BIT_CONFIG_ANALYTICS_REPORTING = 'false';
  process.env.BIT_CONFIG_ANONYMOUS_REPORTING = 'false';
  process.env.BIT_CONFIG_INTERACTIVE = 'false';
  process.env.BIT_CONFIG_USER_TOKEN = bitToken;

  await exec("npm config set '@bit:registry' https://node-registry.bit.cloud");
  await exec(
    "npm config set '@teambit:registry' https://node-registry.bit.cloud"
  );
  await exec(`npm config set //node-registry.bit.cloud/:_authToken ${bitToken}`);

  // bit install dependencies
  await exec("bit install", [], { cwd: wsdir });
}

export default run;
