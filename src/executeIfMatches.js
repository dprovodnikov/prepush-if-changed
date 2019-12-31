import gitChangedFiles from 'git-changed-files';
import getCurrentBranchName from 'git-branch';
import micromatch from 'micromatch';
import exec from 'exec-sh';

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

const withErrorHandling = (fn) => (...args) => {
  return fn(...args).catch(handleExecutionError);
};

export const executeIfMatches = async (config) => {
  if (!config) {
    return Promise.reject(Error('Expected config of type object on input'));
  }

  const currentBranch = await getCurrentBranchName();
  const filenames = await getCommittedFilesnames(currentBranch);

  getPatterns(config).forEach((pattern) => {
    const match = micromatch(filenames, [pattern]);
    const command = config[pattern];

    if (match.length) {
      exec(command);
    }
  });
};

export default withErrorHandling(executeIfMatches);
