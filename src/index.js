import '@babel/polyfill';

import { cosmiconfig } from 'cosmiconfig';
import executeIfMatches from './executeIfMatches';
import { name } from '../package.json';

const main = async () => {
  const { config } = await cosmiconfig(name, {
    searchPlaces: [
      'package.json',
      '.prepushrc',
      '.prepushrc.json',
      '.prepushrc.yaml',
      '.prepushrc.yml',
      '.prepushrc.js',
      'prepush.config.js',
    ],
  }).search();

  executeIfMatches(config);
};

export default main;
