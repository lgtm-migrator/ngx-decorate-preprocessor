export function getStringNameMapper(imp: {getName(): string}): string {
  return imp.getName();
}
