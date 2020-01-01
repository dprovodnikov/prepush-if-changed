import micromatch from 'micromatch';
import execute from 'exec-sh';
import git from './git';

export const executeIfMatches = async (config) => {
  if (!config) {
    return Promise.reject(Error('Expected config of type object on input'));
  }

  const filenames = await git.getCommittedFiles(git.getBranch());

  Object.keys(config).forEach((pattern) => {
    const match = micromatch(filenames, [pattern]);

    if (match.length) {
      execute(config[pattern]);
    }
  });
};

const withErrorHandling = (fn) => (...args) => {
  return fn(...args).catch((err) => {
    process.exit(err === git.UnknownRevisionError ? 0 : 1);
  });
};

export default withErrorHandling(executeIfMatches);
