## Preprocess files for [ngx-decorate](https://www.npmjs.com/package/ngx-decorate#important-aot-compilation-notice).

[![Coverage Status](https://coveralls.io/repos/github/Alorel/ngx-decorate-preprocessor/badge.svg?branch=1.1.18)](https://coveralls.io/github/Alorel/ngx-decorate-preprocessor?branch=1.1.18)
[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/ngx-decorate-preprocessor.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/Alorel/ngx-decorate-preprocessor.svg?branch=1.1.18)](https://travis-ci.com/Alorel/ngx-decorate-preprocessor)


Installation:

    npm install -D ngx-decorate-preprocessor
    
Note: If you use tslint you might need to re-run your fixes on changed files.
    
# CLI usage
## Format files

```bash
ngx-decorate-preprocess format --globs "path/to/src/**/*.ts" --indent 2
```

## Test formatting

Test if files that need formatting aren't formatted; exit with non-zero code on failure.

```bash
ngx-decorate-preprocess test --globs "path/to/src/**/*.ts" --indent 2
```

# Node usage

```javascript
import {formatAsync, formatSync} from 'ngx-decorate-preprocessor';
import * as fs from 'fs';

// File indentation level. Optional, defaults to 2
const indent = 4;
const fileContents = fs.readFileSync('/path/to/file.ts', 'utf8');

// Sync mode
const formattedContents = formatSync(fileContents, indent);

if (fileContents !== formattedContents) {
  fs.writeFileSync('/path/to/file.ts', formattedContents);
}

// Async mode

formatAsync(fileContents, indent)
  .then(formattedContents => {
    if (formattedContents !== fileContents) {
      return new Promise((resolve, reject) => {
        fs.writeFile('/path/to/file.ts', formattedContents, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
      })
    }
  })

```