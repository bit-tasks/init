async function setBitPath(exec) {
  // sets path for subsequent steps
  await exec(`echo "$HOME/bin" >> $GITHUB_PATH`);
}

module.exports = setBitPath;
