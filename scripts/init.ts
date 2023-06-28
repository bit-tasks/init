import * as fs from 'fs';
import * as path from 'path';

export type ExecFunction = (command: string, options?: {cwd: string}) => Promise<number>;

const run: (exec: ExecFunction, wsdir: string) => Promise<void> = async (exec, wsdir) => {
  // get bit version to install
  const wsDirPath = path.resolve(wsdir);
  // sets wsdir env for any external usage
  process.env.WSDIR = wsdir;
  
  const wsFile = path.join(wsDirPath, "workspace.jsonc");
  const workspace = fs.readFileSync(wsFile).toString();
  const match = /"engine": "(.*)"/.exec(workspace);
  const bitEngineVersion = match ? match[1] : "";

  // install bvm globally
  await exec("npm i -g @teambit/bvm");
  // install bit
  await exec(`bvm install ${bitEngineVersion} --use-system-node`);
  // sets path for current step
  process.env.PATH = `${process.env.HOME}/bin:` + process.env.PATH;

  // config bit/npm for CI/CD
  await exec("bit config set interactive false");
  await exec("bit config set analytics_reporting false");
  await exec("bit config set anonymous_reporting false");
  await exec("bit config set user.token $BIT_TOKEN");
  // await exec("npm config set always-auth true");
  //TODO: move these back to "node.bit.cloud" once that promotion occurs
  await exec("npm config set '@bit:registry' https://node-registry.bit.cloud");
  await exec("npm config set '@teambit:registry' https://node-registry.bit.cloud");

  // bit install dependencies
  await exec("bit install", { cwd: wsdir });
}

export default run;
