import { getBundleConfig } from './../config/vite.config.js';
import { getKeyLionConfig } from './../config/keylion.config.js';
import { isDir, getPublicDirs } from './../share/fsUtils.js';
import { kebabCase } from 'keylion-share';
import fse from 'fs-extra';
import { build } from 'vite';
import { EXAMPLE_DIR_NAME, TEST_DIR_NAME, DOCS_DIR_NAME, STYLE_DIR_NAME, ES_DIR, LIB_DIR, UMD_DIR, SRC_DIR } from '../share/constant.js';
import { resolve } from 'path';
import { isDTS, isLess, isScss, isSFC, isScript } from '../share/fsUtils.js';
import { compileSfc } from './compileSFC.js';
import { compileSass, compileLess } from './compileStyle.js';
import { compileScriptFile, compileESEntry } from './compilerScript.js';
import { generateReference } from './compileTypes.js';
import { get } from 'lodash-es';
import { ignoreFile } from '../share/constant.js';
let { readdir, removeSync, ensureFileSync, ensureDir, copy } = fse;
async function ensureFile() {
    await Promise.all([ensureDir(ES_DIR), ensureDir(LIB_DIR), ensureDir(UMD_DIR)]);
}
export async function compileBundle() {
    const config = await getKeyLionConfig();
    const name = kebabCase(get(config, 'name'));
    const buildOptions = [
        {
            format: 'es',
            fileName: `${name}.esm.js`,
            output: ES_DIR,
            emptyOutDir: false,
        },
        {
            format: 'cjs',
            fileName: `${name}.cjs.js`,
            output: LIB_DIR,
            emptyOutDir: false,
        },
        {
            format: 'umd',
            fileName: `${name}.js`,
            output: UMD_DIR,
            emptyOutDir: true,
        },
    ];
    const tasks = buildOptions.map(options => build(getBundleConfig(config, options)));
    await Promise.all(tasks);
}
export async function compilerDir(dirPath) {
    let fileContent = await readdir(dirPath);
    await Promise.all(fileContent.map((filename) => {
        let file = resolve(dirPath, filename);
        [EXAMPLE_DIR_NAME, TEST_DIR_NAME, DOCS_DIR_NAME].includes(filename) && removeSync(file);
        if (isDTS(file) || filename === STYLE_DIR_NAME) {
            return Promise.resolve();
        }
        return compileFile(filename, file);
    }));
}
export async function compileFile(filename, path) {
    isSFC(path) && (compileSfc(filename, path));
    isScss(path) && (compileSass(path));
    isLess(path) && (compileLess(path));
    isScript(path) && (compileScriptFile(path));
    isDir(path) && (compilerDir(path));
}
export async function compileMoudle() {
    let dest = ES_DIR;
    await ensureDir(dest);
    await copy(SRC_DIR, dest);
    let fileDir = await readdir(dest);
    await Promise.all(fileDir.map(file => {
        let curFile = `${dest}/${file}`;
        if (!ignoreFile.includes(file))
            ensureFileSync(resolve(curFile, './style/index.mjs'));
        return isDir(curFile) ? compilerDir(curFile) : null;
    }));
    const publicDirs = await getPublicDirs();
    await compileESEntry(dest, publicDirs);
    generateReference(dest);
}
