import * as fs from 'fs';
import {CommandModule} from 'yargs';
import {CommonCLIOpts} from '../inc/CommonCLIOpts';
import {flatGlob} from '../inc/flatGlob';
import {err, success, warn} from '../inc/logger';
import {formatSync} from '../index';

const cmd: CommandModule = {
  command: 'test',
  describe: 'Exit with non-zero if any of the files are not formatted.',
  handler(c: CommonCLIOpts) {
    const files = flatGlob(c.globs);

    if (!files.length) {
      return warn('No files to process.');
    }

    let errored = false;

    try {
      for (const f of files) {
        const inContents = fs.readFileSync(f, 'utf8');
        const formatted = formatSync(inContents, c.indent);
        if (inContents === formatted) {
          success(`OK: ${f}`);
        } else {
          errored = true;
          err(`Err: ${f}`);
        }
      }

      if (errored) {
        process.exit(1);
      }
    } catch (e) {
      err(e.message);

      throw e;
    }
  }
};

export = cmd;
