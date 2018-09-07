#!/usr/bin/env node

import {join} from 'path';
import * as yargs from 'yargs';
import {StaticConf} from './inc/StaticConf';

const ext = /\.js$/.test(__filename) ? 'js' : 'ts';

yargs.scriptName('ngx-decorate-preprocess')
  .wrap(yargs.terminalWidth())
  .help()
  .alias('v', 'version')
  .option('globs', {
    alias: 'g',
    array: true,
    demandOption: true,
    global: true
  })
  .option('indent', {
    alias: 'i',
    default: StaticConf.INDENT,
    global: true,
    number: true
  })
  .demandCommand(1)
  .commandDir(join(__dirname, 'cli-commands'), {extensions: [ext]})
  .parse();
