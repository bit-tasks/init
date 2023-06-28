async function setBitPath(exec) {
  // sets path for subsequent steps
  await exec(`echo "$HOME/bin" >> $GITHUB_PATH`);
  const bitPath = await exec('where bit');
  console.log(bitPath);
  console.log("###")
}

module.exports = setBitPath;
