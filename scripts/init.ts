import * as fs from "fs";
import * as path from "path";
const { execSync } = require("child_process");

const run: (wsdir: string) => void = (wsdir) => {
  // get bit version to install
  const wsDirPath = path.resolve(wsdir);
  // sets wsdir env for any external usage
  process.env.WSDIR = wsdir;

  const wsFile = path.join(wsDirPath, "workspace.jsonc");
  const workspace = fs.readFileSync(wsFile).toString();
  const match = /"engine": "(.*)"/.exec(workspace);
  const bitEngineVersion = match ? match[1] : "";

  // install bvm globally
  execSync("npm i -g @teambit/bvm", { stdio: "inherit" });
  // install bit
  execSync(`bvm install ${bitEngineVersion} --use-system-node`, {
    stdio: "inherit",
  });
  // sets path for current step
  process.env.PATH = `${process.env.HOME}/bin:` + process.env.PATH;

  // config bit/npm for CI/CD
  execSync("bit config set interactive false", { stdio: "inherit" });
  execSync("bit config set analytics_reporting false", { stdio: "inherit" });
  execSync("bit config set anonymous_reporting false", { stdio: "inherit" });
  execSync("bit config set user.token $BIT_TOKEN", { stdio: "inherit" });
  execSync(`npm config set always-auth true`, { stdio: "inherit" });
  //TODO: move these back to "node.bit.cloud" once that promotion occurs
  execSync(`npm config set @teambit:registry https://node-registry.bit.cloud`, {
    stdio: "inherit",
  });
  execSync(`npm config set //node-registry.bit.cloud/:_authToken $BIT_TOKEN`, {
    stdio: "inherit",
  });

  // bit install dependencies
  execSync("bit install --add-missing-deps", { stdio: "inherit", cwd: wsdir });
};

export default run;
