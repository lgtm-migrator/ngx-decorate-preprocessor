import * as fs from 'fs';
import {CommandModule} from 'yargs';
import {CommonCLIOpts} from '../inc/CommonCLIOpts';
import {flatGlob} from '../inc/flatGlob';
import {err, info, success, warn} from '../inc/logger';
import {formatSync} from '../index';

const cmd: CommandModule = {
  command: 'format',
  describe: 'Format the given globs',
  handler(c: CommonCLIOpts) {
    const files = flatGlob(c.globs);

    if (!files.length) {
      warn('No files to process.');

      return;
    }

    try {
      for (const f of files) {
        const inContents = fs.readFileSync(f, 'utf8');
        const formatted = formatSync(inContents, c.indent);
        if (inContents !== formatted) {
          fs.writeFileSync(f, formatted);
          success(`Formatted: ${f}`);
        } else {
          info(`Skipped: ${f}`);
        }
      }
    } catch (e) {
      err(e.message);

      throw e;
    }
  }
};

export = cmd;
