#!/usr/bin/env node

const executeIfMatches = require('./dist/executeIfMatches').default;

executeIfMatches({
  'src/**/*': 'npm run test',
});
