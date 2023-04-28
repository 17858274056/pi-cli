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
        let file = resolve(dirPath, filename); // 这边拼接到的 示例： src/xx组件/xx.vue || xx.js || xx.css 
        [EXAMPLE_DIR_NAME, TEST_DIR_NAME, DOCS_DIR_NAME].includes(filename) && removeSync(file); // 因为打包所有要把测试用例跟示例代码还有md删了
        if (isDTS(file) || filename === STYLE_DIR_NAME) { // 忽略.d.ts 跟style  style是在前面自己主动建的 暂时里面是没东西的直接忽略
            return Promise.resolve();
        }
        // filename => 组件下面的各个文件  file => filename文件的绝对路径
        return compileFile(filename, file);
    }));
}
export async function compileFile(filename, path) {
    isSFC(path) && (compileSfc(filename, path)); // 编译 sfc vue 文件
    isScss(path) && (compileSass(path)); // 解析 scss
    isLess(path) && (compileLess(path)); // 解析less
    isScript(path) && (compileScriptFile(path)); // 解析js
    isDir(path) && (compilerDir(path)); // 如果是文件就递归解析内部的
}
export async function compileMoudle() {
    let dest = ES_DIR;
    await ensureDir(dest);
    await copy(SRC_DIR, dest);
    let fileDir = await readdir(dest); // 获取第一层文件夹 src/*
    await Promise.all(fileDir.map(file => {
        let curFile = `${dest}/${file}`; // 拼接名字 src/xxx，因为都是create来的格式固定
        if (!ignoreFile.includes(file))
            ensureFileSync(resolve(curFile, './style/index.mjs')); // 查找有没有统一的style
        return isDir(curFile) ? compilerDir(curFile) : null; // 是文件就递归,不是文件就结束
    }));
    const publicDirs = await getPublicDirs();
    await compileESEntry(dest, publicDirs);
    await generateReference(dest);
}
