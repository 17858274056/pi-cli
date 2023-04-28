import { SCRIPTS_EXTENSIONS, STYLE_EXTENSIONS, FILE_EXTENSION, STYLE_EXTENSION, scriptExtNames, IMPORT_FROM_DEPEDENCE_RE, EXPORT_FROM_DEPEDENCE_RE, IMPORT_DEPEDENCE_RE, CSS_RE, LESS_RE, SCSS_RE } from '../share/constant.js';
import { getVersion } from "../share/fsUtils.js";
import babel from '@babel/core';
import fse from 'fs-extra';
import esb from 'esbuild';
import { dirname, extname, resolve } from 'path';
import { isDir, replaceExt, isJsx } from '../share/fsUtils.js';
import { extracStyleDep } from './compileStyle.js';
import { bigCamelize } from 'keylion-share';
// 先 导出 fse 再去解构  为了满足 commonjs 可能没有导出某个函数的情况 不然打包会报错
const { readFileSync, pathExistsSync, readdirSync, removeSync, writeFileSync, writeFile } = fse;
import { ignoreFile } from '../share/constant.js';
function tryMatchExt(file, fileList) {
    for (let ext of fileList) {
        let match = `${file}${ext}`;
        if (pathExistsSync(match)) {
            return ext;
        }
    }
}
export async function completeSuffixDep(file, code) {
    const replacer = function (code, ext) {
        let depFile = ext.replace(/'/g, "").replace(/"/g, ""); // 去除单双引号
        let isNodeModule = !depFile.startsWith('.'); // 获取第一个值 是不是. 只要读本地文件的一般都是相对引用。这边针对自己的组件所以不需要考虑别名情况
        let targetFile = dirname(file); // 去读当前文件的文件夹名字
        let extn = extname(depFile); // 获取后缀
        let targetDepFile = resolve(targetFile, depFile); // 拼接整体
        const done = (targetDep) => code.replace(depFile, targetDep);
        if (isNodeModule) {
            return code;
        }
        if (!extn) {
            if (tryMatchExt(targetDepFile, SCRIPTS_EXTENSIONS)) { // 监测后缀是不是js类型
                return done(`${depFile}.mjs`);
            }
            let styleEXT = tryMatchExt(targetDepFile, STYLE_EXTENSIONS); // 检测是不是css类型
            if (styleEXT) {
                return done(`${depFile}${styleEXT}`);
            }
            if (isDir(targetDepFile)) { // 都不是，如果是文件的 比如 ./xxx 文件 默认的会去去下面的index
                const files = readdirSync(targetDepFile);
                const hasScriptIndex = files.some((file) => FILE_EXTENSION.some((name) => file.endsWith(name)));
                if (hasScriptIndex) { // 是不是js
                    return done(`${depFile}/index.mjs`);
                }
                const hasStyleIndex = files.some((file) => STYLE_EXTENSION.some((name) => file.endsWith(name)));
                if (hasStyleIndex) { // 是不是css
                    return done(`${depFile}/index.css`);
                }
            }
        }
        if (extn) {
            if (scriptExtNames.includes(extn)) {
                return code.replace(extn, '.mjs');
            }
            if (STYLE_EXTENSIONS.includes(extn)) {
                return code;
            }
        }
        return '';
    };
    return code.replace(IMPORT_FROM_DEPEDENCE_RE, replacer).replace(EXPORT_FROM_DEPEDENCE_RE, replacer).replace(IMPORT_DEPEDENCE_RE, replacer);
}
export async function compileScriptFile(file) {
    let source = readFileSync(file, 'utf-8');
    await compileScript(source, file);
}
export async function compileScript(content, filePath) {
    // let {format} =await getKeyLionConfig()
    if (isJsx(filePath)) { // 是否为jsx
        const babelResul = await babel.transformAsync(content, {
            filename: filePath,
            babelrc: false,
            presets: ['@babel/preset-typescript'],
            plugins: [
                [
                    '@vue/babel-plugin-jsx',
                    {
                        enableObjectSlots: false,
                    },
                ],
            ],
        });
        if (babelResul === null || babelResul === void 0 ? void 0 : babelResul.code) { // 拿到编译后的代码
            ({ code: content } = babelResul);
        }
    }
    let { code } = await esb.transform(content, {
        loader: "ts",
        target: "es2016",
        format: "esm"
    });
    if (code) {
        code = await completeSuffixDep(filePath, code);
        code = extracStyleDep(filePath, code, CSS_RE);
        code = extracStyleDep(filePath, code, LESS_RE);
        code = extracStyleDep(filePath, code, SCSS_RE);
        removeSync(filePath);
        writeFileSync(replaceExt(filePath, ".mjs"), code, "utf-8");
    }
}
export async function compileESEntry(dir, publicDIrs) {
    const imports = [];
    const plugins = [];
    const exports = [];
    const cssImports = [];
    const publicComponents = [];
    const scriptExtname = '.mjs';
    publicDIrs.forEach((dirname) => {
        const publicComponent = bigCamelize(dirname);
        const module = `'./${dirname}/index${scriptExtname}'`;
        imports.push(`import ${publicComponent} from  ${module}`);
        exports.push(`export * from ${module}`);
        publicComponents.push(publicComponent);
        plugins.push(`${publicComponent}.install && app.use(${publicComponent})`);
        (!ignoreFile.includes(dirname)) && cssImports.push(`import './${dirname}/style/index${scriptExtname}'`);
    });
    const version = `const version = '${getVersion()}'`;
    const ist = ` function install(app){
        ${plugins.join("\n ")}
      }`;
    //  
    const styleTemplate = ` ${cssImports.join('\n ')}`;
    const indexTemplate = `
${imports.join('\n ')}
${exports.join('\n ')}
${version}
${ist}
export {
version,
install,
${publicComponents.join(",\n ")}
}

export default{
version,
install,
${publicComponents.join(",\n ")}
}
`;
    const bundleTemplate = `\
${imports.join('\n')}\n
${exports.join('\n')}\n
${cssImports.join('\n')}\n
${version}
${ist}
export {
version,
install,
${publicComponents.join(',\n  ')}
}
    
export default {
version,
install,
${publicComponents.join(',\n  ')}
}
    `;
    await Promise.all([
        writeFile(resolve(dir, "index.mjs"), indexTemplate, 'utf-8'),
        writeFile(resolve(dir, "index.bundle.mjs"), bundleTemplate, 'utf-8'),
        writeFile(resolve(dir, "style.mjs"), styleTemplate, 'utf-8')
    ]);
}
