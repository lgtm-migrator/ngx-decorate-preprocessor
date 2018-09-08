import * as fs from 'fs';
import {CommandModule} from 'yargs';
import {CommonCLIOpts} from '../inc/CommonCLIOpts';
import {flatGlob} from '../inc/flatGlob';
import {Logger} from '../inc/logger';
import {formatSync} from '../index';

const cmd: CommandModule = {
  command: 'format',
  describe: 'Format the given globs',
  handler(c: CommonCLIOpts) {
    const files = flatGlob(c.globs);
    const log = Logger.fromOpts(c);

    if (!files.length) {
      log.warn('No files to process.');

      return;
    }

    try {
      for (const f of files) {
        const inContents = fs.readFileSync(f, 'utf8');
        const formatted = formatSync(inContents, c.indent);
        if (inContents !== formatted) {
          fs.writeFileSync(f, formatted);
          log.success(`Formatted: ${f}`);
        } else {
          log.info(`Skipped: ${f}`);
        }
      }
    } catch (e) {
      log.err(e.message);

      throw e;
    }
  }
};

export = cmd;
