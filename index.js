const core = require("@actions/core");
const exec = require("@actions/exec").exec;
const run = require("./scripts/core");

try {
  const wsDir = core.getInput('ws-dir');
  run(exec, wsDir).then(()=>{

    
  });
} catch (error) {
  core.setFailed(error.message);
}
