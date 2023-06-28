const fs = require("fs");
const path = require("path");

async function run(exec, wsdir) {
  // get bit version to install
  const wsDirPath = path.resolve(wsdir);
  const wsFile = path.join(wsDirPath, "workspace.jsonc");
  const workspace = fs.readFileSync(wsFile).toString();
  const match = /"engine": "(.*)"/.exec(workspace);
  const bitEngineVersion = match ? match[1] : "";

  // install bvm globally
  await exec("npm i -g @teambit/bvm");
  // install bit
  await exec(`bvm install ${bitEngineVersion} --use-system-node`);
  // set path
  process.env.PATH = `${process.env.HOME}/bin:` + process.env.PATH; // sets path for current step
  // sets path for subsequent steps
  // fs.appendFileSync(process.env.GITHUB_ENV, `PATH=${process.env.PATH}\n`);

  // sets path for subsequent steps
  await exec(`echo "$HOME/bin" >> $GITHUB_PATH`);

  // config bit/npm for CI/CD
  await exec("bit config set interactive false");
  await exec("bit config set analytics_reporting false");
  await exec("bit config set anonymous_reporting false");
  await exec("bit config set user.token $BIT_TOKEN");
  await exec(`npm config set always-auth true`);
  //TODO: move these back to "node.bit.cloud" once that promotion occurs
  await exec(
    `npm config set @teambit:registry https://node-registry.bit.cloud`
  );
  await exec(`npm config set //node-registry.bit.cloud/:_authToken $BIT_TOKEN`);

  // bit install dependencies
  //await exec('bit install', [], { cwd: wsdir });
}

module.exports = run;
