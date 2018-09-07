export function triggersAnyFilter(p: { triggersAny: boolean }): boolean {
  return p.triggersAny;
}

export function triggersInitFilter(p: { triggersInit: boolean }): boolean {
  return p.triggersInit;
}

export function triggersDestroyFilter(p: { triggersDestroy: boolean }): boolean {
  return p.triggersDestroy;
}
