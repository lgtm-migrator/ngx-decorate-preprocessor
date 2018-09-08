import * as chalk$ from 'chalk';
import {CommonCLIOpts} from './CommonCLIOpts';

const chalk: chalk$.Chalk = chalk$['bgRed'] ? <any>chalk$ : (<any>chalk$).default;

export const enum LogLevel {
  SILENT = 'silent',
  QUIET = 'quiet',
  VERBOSE = 'verbose'
}

function noop(): void {
  // do nothing
}

export class Logger {
  public constructor(lvl: LogLevel) {
    switch (lvl) {
      case LogLevel.QUIET:
        this.info = noop;
        this.success = noop;
        break;
      case LogLevel.SILENT:
        this.info = noop;
        this.success = noop;
        this.warn = noop;
        this.err = noop;
    }
  }

  public static fromOpts(o: Pick<CommonCLIOpts, 'quiet' | 'silent' | 'verbose'>) {
    const ll: LogLevel = o.silent ? LogLevel.SILENT : o.verbose ? LogLevel.VERBOSE : LogLevel.QUIET;

    return new Logger(ll);
  }

  public err(txt: string): void {
    process.stderr.write(chalk.red(txt) + '\n');
  }

  public info(txt: string): void {
    process.stdout.write(chalk.cyan(txt) + '\n');
  }

  public success(txt: string): void {
    process.stdout.write(chalk.green(txt) + '\n');
  }

  public warn(txt: string): void {
    process.stderr.write(chalk.yellow(txt) + '\n');
  }
}
