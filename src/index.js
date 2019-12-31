const gitChangedFiles = require('git-changed-files');
const getCurrentBranchName = require('git-branch');
const micromatch = require('micromatch');
const exec = require('exec-sh');

const UnknownRevisionError = Error('Unknown revision or path not in the working tree');

const getCommittedFilesnames = (branch) => {
  const options = { baseBranch: `origin/${branch}` };

  return gitChangedFiles(options)
    .then(diff => diff.committedFiles)
    .catch(() => {
      throw UnknownRevisionError;
    });
};

const getPatterns = config => Object.keys(config);

const handleExecutionError = (err) => {
  process.exit(err === UnknownRevisionError ? 0 : 1);
};

const executeBeforePush = async (config) => {
  const currentBranch = await getCurrentBranchName();
  const filenames = await getCommittedFilesnames(currentBranch);

  getPatterns(config).map((pattern) => {
    const match = micromatch(filenames, [pattern]);
    const command = config[pattern];

    if (match.length) {
      exec(command);
    }
  });
};

// TODO: move the config definition to package.json or prepushrc.js
const executionConfig = {
  '*': 'npm run test',
};

executeBeforePush(executionConfig).catch(handleExecutionError);