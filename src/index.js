import executeBeforePush from './executeBeforePush';


executeBeforePush({
  '*': 'npm run test',
});
