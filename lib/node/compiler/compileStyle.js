import { resolve, parse } from 'path';
import fse from 'fs-extra';
import sass from 'sass';
import less from 'less';
import { replaceExt } from '../share/fsUtils.js';
let { pathExistsSync, readFileSync, appendFileSync, removeSync, writeFileSync } = fse;
let { render } = less;
export const EMPTY_SPACE_RE = /\s+/g;
export const EMPTY_LINE_RE = /[\n\r]*/g;
export const clearEmptyLine = (code) => code.replace(EMPTY_LINE_RE, '').replace(EMPTY_SPACE_RE, '');
export function extracStyleDep(file, code, reg) {
    var _a;
    const stypeImports = (_a = code.match(reg)) !== null && _a !== void 0 ? _a : [];
    const cssFile = resolve(parse(file).dir, './style/index.mjs');
    stypeImports.forEach((stypeImport) => {
        const normalPath = normalizeStyleDependency(stypeImport, reg);
        smartAppendFileSync(cssFile, `import "${normalPath}.css" \n`);
    });
    return code.replace(reg, '');
}
export function normalizeStyleDependency(styleImport, reg) {
    let relativePath = styleImport.replace(reg, '$1');
    relativePath = relativePath.replace(/(\.less)|(\.css)|(\.scss)/, '');
    if (relativePath.startsWith('./')) {
        return '.' + relativePath;
    }
    return '../' + relativePath;
}
export function smartAppendFileSync(file, code) {
    if (pathExistsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        if (!content.includes(code)) {
            appendFileSync(file, code);
        }
    }
}
export function compileSass(file) {
    const { css } = sass.compile(file);
    removeSync(file);
    writeFileSync(replaceExt(file, ".css"), clearEmptyLine(css), "utf-8");
}
export async function compileLess(file) {
    let source = readFileSync(file, "utf-8");
    const { css } = await render(source, {
        filename: file
    });
    removeSync(file);
    writeFileSync(replaceExt(file, ".css"), clearEmptyLine(css), "utf-8");
}
