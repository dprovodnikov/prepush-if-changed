const gitChangedFiles = require('git-changed-files');
const getCurrentBranchName = require('git-branch');
const micromatch = require('micromatch');
const { run } = require('runjs');

const executeBeforePush = async (config) => {
  const currentBranch = await getCurrentBranchName();
  const diff = await gitChangedFiles({ baseBranch: currentBranch });
  const filenames = diff.committedFiles;

  try {
    Object.keys(config).map((pattern) => {
      const match = micromatch(filenames, [pattern]);

      if (match.length) {
        run(config[pattern]);
      }
    });
  } catch (err) {
    process.exit(1);
  }
};

// TODO: move the config definition to package.json or prepushrc.js
executeBeforePush({
  '*': '$echo "Hello world"',
});
