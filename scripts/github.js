async function setBitHome(exec, wsdir) {
  // sets path for subsequent steps
  await exec(`echo "$HOME/.bvm/bin" >> $GITHUB_PATH`);
}

module.exports = setBitHome;
