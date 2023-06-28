const fs = require("fs");
const core = require("@actions/core");
const exec = require("@actions/exec").exec;
const run = require("./scripts/core");

try {
  const wsDir = core.getInput('ws-dir');
  run(exec, wsDir).then(()=>{
    // Set Bit path for subsequent steps in GitHub Actions
    fs.appendFileSync(process.env.GITHUB_PATH, process.env.PATH);
  });
} catch (error) {
  core.setFailed(error.message);
}
