import { SRC_DIR, DOCS_DIR_NAME, ROOT_DOCS_DIR } from '../share/constant.js';
import fse from 'fs-extra'
import { getKeyLionConfig, keylionConfig } from '../config/keylion.config.js'
import { resolve } from 'path'
import { camelize } from 'keylion-share'
import slash from 'slash'
let { readdirSync, readdir } = fse

interface documentsType {
    path: string
    component: any
    name: string
}

export async function resolveDocument() { // 生成routes
    // let filePath = resolve()
    let config = await getKeyLionConfig()
    let { defaultLanguage } = config
    let dirs = readdirSync(SRC_DIR)
    let documents: documentsType[] = []

    dirs.forEach(i => {
        let fileDirs = readdirSync(resolve(SRC_DIR, i))
        fileDirs.forEach(f => {
            if (f === DOCS_DIR_NAME) {
                let docsDir = slash(resolve(SRC_DIR, i, DOCS_DIR_NAME))
                documents.push({
                    name: camelize(i),
                    path: `/${defaultLanguage}/${i}`,
                    component: `${docsDir}/${defaultLanguage}.md`
                })
            }
        })


    })



    function genImportDocuments(items: documentsType[]) {
        return items
            .map((item) => {
                const path = slash(item.component);
                return `const ${item.name} = () => import('${path}');`;
            })
            .join('\n');
    }

    function constDocument(documents: documentsType[]) {
        return `${genImportDocuments(documents)}`
    }

    function exportConstDocument(documents: documentsType[]) {
        return `export default {
            ${documents.map(i => i.name).join(",")}
        }`
    }

    let code = `
    ${constDocument(documents)} \n
    ${exportConstDocument(documents)}

  `
    return code
}


