import * as fs from 'fs';
import * as path from 'path';
import stripJsonComments from 'strip-json-comments';

export type ExecFunction = (command: string, options?: {cwd: string}) => Promise<number>;

const run: (exec: ExecFunction, wsdir: string) => Promise<void> = async (exec, wsdir) => {
  // get bit version to install
  const wsDirPath = path.resolve(wsdir);
  // sets wsdir env for any external usage
  process.env.WSDIR = wsdir;
  
  const wsFile = path.join(wsDirPath, "workspace.jsonc");
  const workspace = fs.readFileSync(wsFile).toString();
  const engineVersionMatch = /"engine": "(.*)"/.exec(workspace);
  const bitEngineVersion = engineVersionMatch ? engineVersionMatch[1] : "";

  const contentWithoutComments: string = stripJsonComments(workspace);
  const jsonData: any = JSON.parse(contentWithoutComments);
  const defaultScope: string = jsonData['teambit.workspace/workspace'].defaultScope;

  const [Org, Scope] = defaultScope.split('.');
  process.env.ORG = "tttttt";
  process.env.SCOPE = defaultScope;

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
  await exec("npm config set //node-registry.bit.cloud/:_authToken $BIT_TOKEN");

  // bit install dependencies
  await exec("bit install", { cwd: wsdir });
}

export default run;
