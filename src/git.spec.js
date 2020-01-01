jest.mock('git-changed-files', () => jest.fn());

import gitChangedFilesSpy from 'git-changed-files';
import { checkExistanceOnRemote } from './git';

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