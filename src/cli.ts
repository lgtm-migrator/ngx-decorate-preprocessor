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
  .option('quiet', {
    alias: 'q',
    boolean: true,
    default: true,
    description: 'Set the logging level to "quiet" which only outputs error and warning messages.',
    global: true
  })
  .option('silent', {
    alias: 's',
    boolean: true,
    default: false,
    description: 'Set the logging level to "silent" which outputs nothing.'
  })
  .option('verbose', {
    alias: 'e',
    boolean: false,
    default: false,
    description: 'Set the logging level to "verbose" which outputs everything'
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
