# prepush-if-changed

Command-runner for commited files written to be used as a pre-push hook

---

## Installation

**Using npm**

    npm install --save-dev prepush-if-changed

**Using yarn**

    yarn add -D prepush-if-changed

---

## Why

It doesn't always make sense to run pre-push hooks on every push. Sometimes you need to trigger a hook only when the pushed changes affect a specific area of your file structure. This project contains a script that will check committed files against a glob pattern and only trigger the task if there's a match.

The script will compare your current local branch with the remote(origin) one. If the remote branch does not exist the script will exit with code 0 without performing any execution.

## Configuration

---

You are going to need a git hook management library. We'll use `husky` for this example.

A configuration like this will execute unit tests once you attempt to push changes of any `js/jsx` files inside the `src` folder

This example uses `package.json` for configuration.

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-push": "prepush-if-changed"
    }
  },
  "prepush-if-changed": {
    "src/**/*.js?(x)": "npm run test" // run you linter, tests etc.
  }
}
```

You can use the following files to write a config:

    package.json,
    .prepushrc,
    .prepushrc.json,
    .prepushrc.yaml,
    .prepushrc.yml,
    .prepushrc.js,
    prepush.config.js,


## Matching files

---

Your commands will be executed only if any of the committed files match the glob pattern. `prepush-if-changed´ uses [micromatch](https://github.com/micromatch/micromatch) for matching files.


