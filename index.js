const gitChangedFiles = require('git-changed-files');
const getCurrentBranchName = require('git-branch');
const micromatch = require('micromatch');
const { run } = require('runjs');

/* eslint-disable */

const getCommitedFilenames = () => {
  return getCurrentBranchName()
    .then(branch => gitChangedFiles({ baseBranch: `origin/${branch}` }))
    .then(diff => diff.committedFiles);
};

const executeBeforePush = (config) => {
  getCommitedFilenames()
    .then((filenames) => {
      Object.keys(config).map((pattern) => {
        const match = micromatch(filenames, [pattern]);

        if (match.length) {
          run(config[pattern]);
        }
      });
    })
    .catch(() => process.exit(1));
};

// TODO: move the config definition to package.json or prepushrc.js
executeBeforePush({
  '*.js': '$echo "Hello world"',
});
