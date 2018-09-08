import * as fs from 'fs';
import {CommandModule} from 'yargs';
import {CommonCLIOpts} from '../inc/CommonCLIOpts';
import {flatGlob} from '../inc/flatGlob';
import {Logger} from '../inc/logger';
import {formatSync} from '../index';

const cmd: CommandModule = {
  command: 'test',
  describe: 'Exit with non-zero if any of the files are not formatted.',
  handler(c: CommonCLIOpts) {
    const files = flatGlob(c.globs);
    const log = Logger.fromOpts(c);

    if (!files.length) {
      log.warn('No files to process.');

      return;
    }

    let errored = false;

    try {
      for (const f of files) {
        const inContents = fs.readFileSync(f, 'utf8');
        const formatted = formatSync(inContents, c.indent);
        if (inContents === formatted) {
          log.success(`OK: ${f}`);
        } else {
          errored = true;
          log.err(`Err: ${f}`);
        }
      }

      if (errored) {
        process.exit(1);
      }
    } catch (e) {
      log.err(e.message);

      throw e;
    }
  }
};

export = cmd;
