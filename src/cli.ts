#!/usr/bin/env node

import {join} from 'path';
import * as yargs from 'yargs';
import {StaticConf} from './inc/StaticConf';

const ext = /\.js$/.test(__filename) ? 'js' : 'ts';

const argv = yargs.scriptName('ngx-decorate-preprocess')
  .wrap(yargs.terminalWidth())
  .help()
  .alias('v', 'version')
  .option('globs', {
    alias: 'g',
    array: true,
    demandOption: true,
    description: 'Globs to process',
    global: true
  })
  .option('indent', {
    alias: 'i',
    default: StaticConf.INDENT,
    description: 'Indentation level in your files',
    global: true,
    number: true
  })
  .demandCommand(1)
  .commandDir(join(__dirname, 'cli-commands'), {extensions: [ext]});

/** @internal */
export function runCmd(args: string | string[]): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    argv.parse(args, {}, (err, _argv, output) => {
      if (err) {
        process.stderr.write(output);
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

if (!process.env.RUNNING_TESTS) {
  argv.global('config').parse();
}
