import '@babel/polyfill';

jest.mock('exec-sh', () => jest.fn());
jest.mock('git-changed-files', () => jest.fn());

import execSpy from 'exec-sh';
import gitChangedFilesSpy from 'git-changed-files';

import { executeIfMatches } from './executeIfMatches';

describe('executeIfMatches()', () => {
  beforeEach(() => {
    execSpy.mockClear();
    gitChangedFilesSpy.mockClear();
  });

  test('should execute command if any files match the pattern', async () => {
    gitChangedFilesSpy.mockReturnValue(Promise.resolve({
      committedFiles: ['package.json', 'src/index.js'],
    }));

    await executeIfMatches({
      '**/*.js': 'npm run test',
    });

    expect(execSpy.mock.calls[0][0]).toBe('npm run test');
  });

  test('should not execute command if no files match the pattern', async () => {
    gitChangedFilesSpy.mockReturnValue(Promise.resolve({
      committedFiles: ['package.json', 'src/index.css'],
    }));

    await executeIfMatches({
      '**/*.js': 'echo Hello, World!',
    });

    expect(execSpy).not.toBeCalled();
  });

  test('should not execute command if gitChangedFiles rejects', async () => {
    gitChangedFilesSpy.mockReturnValue(
      Promise.reject(Error('Unexpected error'))
    );

    try {
      await executeIfMatches(undefined);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(true).toBeTruthy();
    }
  });

  test('should reject if no config was passed on input', async () => {
    try {
      await executeIfMatches(undefined);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(true).toBeTruthy();
    }
  });

  test('should throw if execSh calls the callback with error object', () => {
    gitChangedFilesSpy.mockReturnValue(Promise.resolve({
      committedFiles: ['package.json', 'src/index.js'],
    }));

    execSpy.mockImplementation((_, callback) => {
      callback(new Error('programm exited with code 1'));
    });
    
    const output = executeIfMatches({ '**/*.js': 'npm run test' });

    return expect(output).rejects.toBeInstanceOf(Error);
  });
});
