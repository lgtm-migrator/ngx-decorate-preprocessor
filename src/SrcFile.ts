import {ClassDeclaration, ImportDeclaration, ImportSpecifier, SourceFile} from 'ts-simple-ast';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {SrcClass} from './SrcClass';

export class SrcFile {
  public constructor(public readonly src: SourceFile) {
  }

  @LazyGetter()
  public get classes(): SrcClass[] {
    return this.src.getClasses()
      .map(this.relevantClassMapper, this); //tslint:disable-line:no-unbound-method
  }

  public get importDeclarations(): ImportDeclaration[] {
    return this.src.getImportDeclarations();
  }

  public importsFromModule(name: string): ImportDeclaration | void {
    for (const dec of this.importDeclarations) {
      if (dec.getModuleSpecifierValue() === name) {
        return dec;
      }
    }
  }

  public imports(item: string, moduleName: string): ImportSpecifier | void {
    for (const dec of this.importDeclarations) {
      if (dec.getModuleSpecifierValue() === moduleName) {
        for (const imp of dec.getNamedImports()) {
          if (imp.getName() === item) {
            return imp;
          }
        }
      }
    }

  }

  public processClasses(): void {
    for (const clazz of this.classes) {
      clazz.process();
    }
  }

  private relevantClassMapper(c: ClassDeclaration): SrcClass {
    return new SrcClass(this, c);
  }
}
