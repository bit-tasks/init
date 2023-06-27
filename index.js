const core = require("@actions/core");
const exec = require("@actions/exec").exec;
const run = require("./scripts/init");

try {
  const wsDir = core.getInput('ws-dir');
  console.log("#####");
  console.log(wsDir)
  run(exec, wsDir);
} catch (error) {
  core.setFailed(error.message);
}
