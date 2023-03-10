export declare const EMPTY_SPACE_RE: RegExp;
export declare const EMPTY_LINE_RE: RegExp;
export declare const clearEmptyLine: (code: string) => string;
export declare function extracStyleDep(file: string, code: string, reg: RegExp): string;
export declare function normalizeStyleDependency(styleImport: string, reg: RegExp): string;
export declare function smartAppendFileSync(file: string, code: string): void;
export declare function compileSass(file: string): void;
export declare function compileLess(file: string): Promise<void>;
