import 'babel-polyfill';

jest.mock('git-changed-files', () => jest.fn());
jest.mock('git-branch-parent', () => jest.fn());

import gitChangedFilesSpy from 'git-changed-files';
import gitBranchParentSpy from 'git-branch-parent';
import { checkExistanceOnRemote, getCommittedFiles } from './git';

describe('checkExistanceOnRemote()', () => {
  it('should be callable', () => {
    expect(checkExistanceOnRemote).toBeInstanceOf(Function);
  });

  it('should return a promise', () => {
    gitChangedFilesSpy.mockReturnValueOnce(Promise.resolve());
    expect(checkExistanceOnRemote()).toBeInstanceOf(Promise);
  });

  it('should resolve to true if branch exists', () => {
    gitChangedFilesSpy.mockReturnValueOnce(Promise.resolve());
    expect(checkExistanceOnRemote()).resolves.toBe(true);
  });

  it('should resolve to false if branch does not exist', () => {
    gitChangedFilesSpy.mockReturnValueOnce(Promise.reject());
    expect(checkExistanceOnRemote()).resolves.toBe(false);
  });
});

describe('getCommittedFiles()', () => {
  it('should be callable', () => {
    expect(getCommittedFiles).toBeInstanceOf(Function);
  });

  it('should return a promise', () => {
    gitChangedFilesSpy
      .mockReturnValueOnce(Promise.resolve())
      .mockReturnValueOnce(Promise.resolve({ committedFiles: [] }));

    expect(getCommittedFiles()).toBeInstanceOf(Promise);
  });

  it('should resolve to a list of committed files', () => {
    const output = {
      committedFiles: ['package.json', 'src/index.js'],
    };

    gitChangedFilesSpy
      .mockReturnValueOnce(Promise.resolve())
      .mockReturnValueOnce(Promise.resolve(output));

    expect(getCommittedFiles()).resolves.toEqual(output.committedFiles);
  });

  it('should diff against the parent branch if current does not exist on remote', async () => {
    gitBranchParentSpy.mockReturnValueOnce('origin/master');

    const diff = {
      committedFiles: ['package.json', 'src/index.js'],
    };

    gitChangedFilesSpy
      .mockReturnValueOnce(Promise.reject())
      .mockReturnValueOnce(Promise.resolve(diff));

    const output = await getCommittedFiles();

    expect(gitBranchParentSpy).toBeCalled();
    expect(output).toEqual(diff.committedFiles);
  });
  
  it('should throw if both current and parent branches do not exist on remote', () => {
    gitBranchParentSpy.mockReturnValueOnce('origin/master');
    gitChangedFilesSpy
      .mockReturnValueOnce(Promise.reject())
      .mockReturnValueOnce(Promise.reject());

    return getCommittedFiles()
      .then(() => expect(true).toBeFalsy())
      .catch(() => expect(true).toBeTruthy());
  });
});