import gitChangedFiles from 'git-changed-files';
import getCurrentBranch from 'git-branch';
import getParentBranch from 'git-branch-parent';

export const UnknownRevisionError = Error(
  'Unknown revision or path not in the working tree',
);

const checkExistanceOnRemote = (branch) => {
  return new Promise((resolve) => {
    gitChangedFiles({ baseBranch: `origin/${branch}` })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
};

const getCommittedFiles = (branch) => {
  return checkExistanceOnRemote(branch)
    .then(exists => exists ? branch : getParentBranch.sync())
    .then((baseBranch) => {
      const options = {
        baseBranch: `origin/${baseBranch}`,
        showUnCommitted: false,
      };

      return gitChangedFiles(options);
    })
    .then(diff => diff.committedFiles)
    .catch(() => {
      throw UnknownRevisionError;
    });
};


export default {
  getCommittedFiles,
  getBranch: getCurrentBranch.sync,
};
