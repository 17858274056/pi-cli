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

function injectRender(code: string, sc: string) {
    if (DEFINE_EXPORT_START_RE.test(code)) {
        return code.trim().replace(
            DEFINE_EXPORT_START_RE,
            `${sc}\nexport default defineComponent({
          render,\
            `
        )
    }
    if (NORMAL_EXPORT_START_RE.test(code)) {
        return code.trim().replace(
            NORMAL_EXPORT_START_RE,
            `${sc}\nexport default {render,`
        )
    }
    return code
}




export async function compileSfc(filename: string, path: string) { // 编译 sfc 
    let source = await readFile(path, 'utf-8')
    let { descriptor } = parseSFC(source, { sourceMap: false, filename })
    let { template, script, styles, scriptSetup } = descriptor
    let id = hash(source)
    const hasScope = styles.some((style) => style.scoped)
    const scopeId = hasScope ? `data-v-${id}` : ''
    let scriptContent = ''
    let bindingMetadata;
    if (script || scriptSetup) {
        if (scriptSetup) {

            const { bindings, content } = cSc(descriptor, {
                id
            })
            scriptContent += content
            bindingMetadata = bindings
        } else {
            scriptContent += script?.content
        }

        let render = template && compileTemplate({
            id,
            source: template.content,
            filename,
            compilerOptions: {
                bindingMetadata
            }
        })

        if (render) {
            let { code } = render
            scriptContent = injectRender(scriptContent, code)
        }
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