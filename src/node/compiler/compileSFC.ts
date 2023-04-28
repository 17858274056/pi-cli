import {
    compileTemplate, parse
        as parseSFC,
    compileStyle,
    compileScript as cSc
} from '@vue/compiler-sfc'
import type { SFCStyleBlock } from '@vue/compiler-sfc'
import { replaceExt } from '../share/fsUtils.js'
import { compileScript } from './compilerScript.js'
import fse from 'fs-extra'
import { normalizeStyleDependency, extracStyleDep, smartAppendFileSync, compileLess, compileSass } from './compileStyle.js'
import { STYLE_IMPORT_RE } from '../share/constant.js'
import { parse, resolve } from 'path'
import hash from 'hash-sum'
let { readFile, writeFileSync } = fse
const NORMAL_EXPORT_START_RE = /export\s+default\s+{/
const DEFINE_EXPORT_START_RE = /export\s+default\s+defineComponent\s*\(\s*{/

const REENDER = "__vue_render__"
const VUESFC = "__vue_sfc__"

function injectRender(script: string, render: string) {
    script = script.trim()

    render = render.replace('export function render', `function ${REENDER}`)

    script += `\n${render}\n${VUESFC}.render=${REENDER}\n`

    return script
}




export async function compileSfc(filename: string, path: string) { // 编译 sfc 
    let source = await readFile(path, 'utf-8') // 直接根据绝对路径读出 源码
    let { descriptor } = parseSFC(source, { sourceMap: false, filename }) // 用 @vue/compile-sfc 的parse去解析生成ast
    let { template, script, styles, scriptSetup } = descriptor // 获得 sfc的每个部件
    let id = hash(source) // 根据源码生成一个唯一的hash

    const hasScope = styles.some((style) => style.scoped)
    const scopeId = hasScope ? `data-v-${id}` : ''; // 检察styles是否带Scoped 带了的话去生成一个hash
    let scriptContent = '' // js 代码块部分编译后结果
    let bindingMetadata; // setup语法的变量对象
    if (script || scriptSetup) { // 两种模式  是普通js 还是setup模式
        if (scriptSetup) {

            const { bindings, content } = cSc(descriptor, {
                id
            }) // 如果setup 模式 需要解析两个 一个是 bindings 里面包括了在setup中声明的所有变量包括引入的 
            // content 就是内容
            scriptContent += content
            bindingMetadata = bindings
        } else {
            scriptContent += script?.content
        }

        let render = template && compileTemplate({ // 
            id,
            source: template.content,
            filename,
            compilerOptions: { // setup模式需要， 传入bindings 让他解析 用于把template上面的值动态替换掉
                // 不指定的时候读去的是_ctx下面的就是上下文的， 指定了之后直接去读$setup 
                // 比如{{c}}  不指定的时候读的是_ctx.c 指定了之后去读 $setup.c
                bindingMetadata
            }
        })
        scriptContent = scriptContent.replace('export default', `const ${VUESFC}=`)
        if (render) {
            let { code } = render //code 是被编译之后的代码
            scriptContent = injectRender(scriptContent, code)
        }
        scriptContent += `export default ${VUESFC}`
        await compileScript(scriptContent, path)
        for (let i = 0; i < styles.length; i++) {
            const style: SFCStyleBlock = styles[i]
            const file = replaceExt(path, `Sfc${i || ''}.${styles[i].lang || "css"}`);
            const { base, dir } = parse(file);
            const dependencyPath = normalizeStyleDependency(base, STYLE_IMPORT_RE)
            const cssFile = resolve(dir, `./style/index.mjs`);

            let { code } = compileStyle({
                id: scopeId,
                scoped: style.scoped,
                filename: path,
                source: style.content
            })
            code = extracStyleDep(file, code, STYLE_IMPORT_RE)
            writeFileSync(file, code, "utf-8")
            smartAppendFileSync(cssFile, `import "${dependencyPath}.css" \n`)
            if (style.lang === 'less') {
                await compileLess(file)
            } else if (style.lang === 'scss') {
                await compileSass(file)
            }
        }
    }

}