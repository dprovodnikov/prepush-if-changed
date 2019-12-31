const { spawn } = require('child_process');

const run = (command) => {
  const childProcess = spawn(command, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Exit with error code: ${code}`));
      }
    });

    childProcess.once('error', reject);
  });
};


module.exports = run;
