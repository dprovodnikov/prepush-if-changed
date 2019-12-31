#!/usr/bin/env node

const { cosmiconfig } = require('cosmiconfig');
const executeIfMatches = require('./dist/executeIfMatches').default;

const loadConfig = () => {
  return cosmiconfig('prepush-if-changed', {
    searchPlaces: [
      'package.json',
      '.prepushrc',
      '.prepushrc.json',
      '.prepushrc.yaml',
      '.prepushrc.yml',
      '.prepushrc.js',
      'prepush.config.js',
    ]
  })
  .search()
  .then(result => result.config);
};

loadConfig()
.then(config => {
  console.log(config);
  return config;
})
.then(executeIfMatches);
