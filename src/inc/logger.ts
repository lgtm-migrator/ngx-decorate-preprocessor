import * as chalk$ from 'chalk';

const chalk: chalk$.Chalk = chalk$['bgRed'] ? <any>chalk$ : (<any>chalk$).default;

export function success(txt: string): void {
  console.log(chalk.green(txt));
}

export function warn(txt: string): void {
  console.log(chalk.yellow(txt));
}

export function err(txt: string): void {
  console.error(chalk.red(txt));
}

export function info(txt: string): void {
  console.log(chalk.cyan(txt));
}
