const core = require("@actions/core");
const exec = require("@actions/exec").exec;
const run = require("./scripts/core");
const setBitPath = require("./scripts/github");

try {
  const wsDir = core.getInput('ws-dir');
  run(exec, wsDir);
  setBitPath(exec);
} catch (error) {
  core.setFailed(error.message);
}
