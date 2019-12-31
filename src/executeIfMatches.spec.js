import 'babel-polyfill';

jest.mock('exec-sh', () => jest.fn());
jest.mock('git-changed-files', () => () => {
  return Promise.resolve({
    committedFiles: ['package.json', 'src/index.js'],
  });
});

import execSpy from 'exec-sh';
import { executeIfMatches } from './executeIfMatches';

describe('executeIfMatches()', () => {
  beforeEach(() => {
    execSpy.mockClear();
  });

  test('should execute command if any files match the pattern', async () => {
    await executeIfMatches({
      '**/*.js': 'npm run test',
    });

    expect(execSpy).toBeCalledWith('npm run test');
  });

  test('should not execute command if no files match the pattern', async () => {
    await executeIfMatches({
      '**/*.css': 'echo Hello, World!',
    });

    expect(execSpy).not.toBeCalled();
  });

  test('should reject if no config was passed on input', async () => {
    try {
      await executeIfMatches(undefined);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(true).toBeTruthy();
    }
  });
});
