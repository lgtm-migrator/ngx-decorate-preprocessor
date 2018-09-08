import {expect} from 'chai';
import * as cp from 'child_process';
import * as xSpawn from 'cross-spawn';
import * as fs from 'fs-extra';
import {merge} from 'lodash';
import {join} from 'path';
import * as tmp from 'tmp';
import {v4 as uuid} from 'uuid';
import {formatAsync, formatSync} from '../src';
import {runCmd} from '../src/cli';

//tslint:disable:max-file-line-count

tmp.setGracefulCleanup();

describe('format', () => {
  let fixAddSrc: string;
  let fixRmSrc: string;

  let fixAddDest: string;
  let fixRmDest: string;

  function spawn(cmd: string, args: string[] = [], opts: cp.SpawnOptions = {}): cp.ChildProcess {
    const env = Object.assign({}, process.env, {TS_NODE_TRANSPILE_ONLY: 'true'});
    delete env.RUNNING_TESTS;

    return xSpawn(
      cmd,
      args,
      merge(
        {
          env: env,
          stdio: 'ignore'
        },
        opts
      )
    );
  }

  function trim(contents: string): string {
    return contents.trim().split(/\n/g)
      .map(l => l.trim())
      .join('\n');
  }

  function fixture(name: string): Promise<string> {
    return fs.readFile(join(__dirname, 'fixtures', name), 'utf8')
      .then(trim);
  }

  before('read fixtures', async () => {
    const a$ = fixture('requires-add.raw');
    const r$ = fixture('requires-remove.raw');

    const ad$ = fixture('requires-add.formatted');
    const rd$ = fixture('requires-remove.formatted');

    fixAddSrc = await a$;
    fixRmSrc = await r$;
    fixAddDest = await ad$;
    fixRmDest = await rd$;
  });

  describe('CLI', () => {
    let outPath: string;
    let outContent: string;

    function mkTmpFile(cb: any) {
      tmp.tmpName({postfix: '.ts'}, (err, p) => {
        if (err) {
          cb(err);
        } else {
          outPath = p;
          cb();
        }
      });
    }

    function readOut(): Promise<string> {
      return fs.readFile(outPath, 'utf8')
        .then(trim)
        .then(c => {
          outContent = c;

          return c;
        });
    }

    function writeOut(c: string): Promise<void> {
      return fs.writeFile(outPath, c);
    }

    describe('format', () => {
      describe('Add', () => {
        before('outPath', mkTmpFile);
        before('write', () => writeOut(fixAddSrc));
        before('run', () => runCmd(['format', '--globs', outPath]));
        before('read', readOut);

        it('', () => {
          expect(outContent).to.eq(fixAddDest);
        });
      });

      describe('Remove', () => {
        before('outPath', mkTmpFile);
        before('write', () => writeOut(fixRmSrc));
        before('run', () => runCmd(['format', '--globs', outPath]));
        before('read', readOut);

        it('', () => {
          expect(outContent).to.eq(fixRmDest);
        });
      });
    });

    describe('Invalid command check', () => {
      before('outPath', mkTmpFile);
      before('write', () => writeOut(fixAddDest));

      it('Valid command should exit with 0', (cb: any) => {
        let err = false;
        spawn('ts-node', ['src/cli.ts', 'test', '--globs', outPath])
          .once('error', e => {
            err = true;
            cb(e);
          })
          .once('exit', code => {
            if (!err) {
              if (code === 0) {
                cb();
              } else {
                cb(`Code ${code}`);
              }
            }
          });
      });

      it('Invalid command should exit with non-zero', (cb: any) => {
        let err = false;
        spawn('ts-node', ['src/cli.ts', uuid(), '--globs', outPath])
          .once('error', () => {
            err = true;
            cb();
          })
          .once('exit', code => {
            if (!err) {
              if (code === 0) {
                cb('Edited with 0');
              } else {
                cb();
              }
            }
          });
      });
    });

    describe('test', () => {
      describe('OK', () => {
        before('outPath', mkTmpFile);
        before('write', () => writeOut(fixAddDest));

        it('Should exit with 0', (cb: any) => {
          let err = false;
          spawn('ts-node', ['src/cli.ts', 'test', '--globs', outPath])
            .once('error', e => {
              err = true;
              cb(e);
            })
            .once('exit', code => {
              if (!err) {
                if (code === 0) {
                  cb();
                } else {
                  cb(`Code ${code}`);
                }
              }
            });
        });
      });

      describe('Failing', () => {
        before('outPath', mkTmpFile);
        before('write', async () => {
          const c = await fixture('requires-remove.failing');
          await writeOut(c);
        });

        it('Should exit with non-0', (cb: any) => {
          let err = false;
          spawn('ts-node', ['src/cli.ts', 'test', '--globs', outPath])
            .once('error', () => {
              err = true;
              cb();
            })
            .once('exit', code => {
              if (!err) {
                if (code === 0) {
                  cb('Code 0');
                } else {
                  cb();
                }
              }
            });
        });
      });

    });
  });

  describe('Node', () => {
    describe('Add', () => {
      it('sync', () => {
        const formatted = trim(formatSync(fixAddSrc));
        expect(formatted).to.eq(fixAddDest);
      });

      it('async', async () => {
        const formatted = trim(await formatAsync(fixAddSrc));
        expect(formatted).to.eq(fixAddDest);
      });
    });

    describe('Remove', () => {
      it('sync', () => {
        const formatted = trim(formatSync(fixRmSrc));
        expect(formatted).to.eq(fixRmDest);
      });
      it('async', async () => {
        const formatted = trim(await formatAsync(fixRmSrc));
        expect(formatted).to.eq(fixRmDest);
      });
    });
  });
});
