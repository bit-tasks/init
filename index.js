const core = require("@actions/core");
const exec = require("@actions/exec").exec;
const run = require("../../scripts/initialize-bit");

try {
  run(exec);
} catch (error) {
  core.setFailed(error.message);
}
