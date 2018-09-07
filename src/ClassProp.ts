import {ClassInstanceMemberTypes, Decorator} from 'ts-simple-ast';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {getStringNameMapper} from './inc/getStringNameMapper';
import {triggersDestroy, triggersInit} from './inc/triggering-decorators';
import {SrcClass} from './SrcClass';
import intersection = require('lodash/intersection');

export class ClassProp {
  public constructor(public readonly clazz: SrcClass, private readonly prop: ClassInstanceMemberTypes) {
  }

  @LazyGetter()
  public get triggersAny(): boolean {
    return this.triggersDestroy || this.triggersInit;
  }

  @LazyGetter()
  public get triggersDestroy(): boolean {
    return !!intersection(this.decoratorNames, triggersDestroy).length;
  }

  @LazyGetter()
  public get triggersInit(): boolean {
    return !!intersection(this.decoratorNames, triggersInit).length;
  }

  @LazyGetter()
  private get decoratorNames(): string[] {
    return this.decorators.map(getStringNameMapper);
  }

  @LazyGetter()
  private get decorators(): Decorator[] {
    return this.prop.getDecorators();
  }
}