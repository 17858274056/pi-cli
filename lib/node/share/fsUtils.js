import globSync from 'glob';
import fse from 'fs-extra';
import { extname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { CLI_PACKAGE_JSON, PUBLIC_DIR_INDEXES, SCRIPTS_EXTENSIONS, SRC_DIR, UI_PACKAGE_JSON } from './constant.js';
const { appendFileSync, ensureFileSync, lstatSync, outputFileSync, pathExistsSync, readdir, readFileSync, readJSONSync, } = fse;
export const JSX_REGEXP = /\.(j|t)sx$/;
export function getVersion() {
    return readJSONSync(UI_PACKAGE_JSON).version;
}
export const isMD = (file) => pathExistsSync(file) && extname(file) === '.md';
export const isDir = (file) => pathExistsSync(file) && lstatSync(file).isDirectory();
export const isSFC = (file) => pathExistsSync(file) && extname(file) === '.vue';
export const isDTS = (file) => pathExistsSync(file) && file.endsWith('.d.ts');
export const isScript = (file) => pathExistsSync(file) && SCRIPTS_EXTENSIONS.includes(extname(file));
export const isLess = (file) => pathExistsSync(file) && extname(file) === '.less';
export const isScss = (file) => pathExistsSync(file) && extname(file) === '.scss';
export const isJsx = (path) => JSX_REGEXP.test(path);
export const replaceExt = (file, ext) => file.replace(extname(file), ext);
export const getPublicDirs = async () => {
    const srcDir = await readdir(SRC_DIR);
    console.log(srcDir);
    return srcDir.filter((filename) => isPublicDir(resolve(SRC_DIR, filename)));
};
// 补充react 与 uniapp
// export const
export const isPublicDir = (dir) => PUBLIC_DIR_INDEXES.some((index) => pathExistsSync(resolve(dir, index)));
export function glob(pattern) {
    return new Promise((resolve, reject) => {
        globSync(pattern, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
export function getDirname(url) {
    return fileURLToPath(new URL('.', url));
}
export function getCliVersion() {
    return readJSONSync(CLI_PACKAGE_JSON).version;
}
export function outputFileSyncOnChange(path, code) {
    ensureFileSync(path);
    const content = readFileSync(path, 'utf-8');
    if (code !== content) {
        outputFileSync(path, code);
    }
}
export function getCliMode() {
    var _a, _b;
    return (_b = (_a = readJSONSync(CLI_PACKAGE_JSON)) === null || _a === void 0 ? void 0 : _a.mode) !== null && _b !== void 0 ? _b : "vue";
}
