import {sync as glob} from 'glob';

export function flatGlob(globs: string[]): string[] {
  const files: string[] = [];

  for (const g of globs) {
    files.push(...glob(g, {absolute: true}));
  }

  return files;
}