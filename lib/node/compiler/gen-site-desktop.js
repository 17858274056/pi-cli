import { SRC_DIR, DOCS_DIR_NAME } from '../share/constant.js';
import fse from 'fs-extra';
import { getKeyLionConfig } from '../config/keylion.config.js';
import { resolve } from 'path';
import { camelize } from 'keylion-share';
import slash from 'slash';
let { readdirSync, readdir } = fse;
export async function resolveDocument() {
    // let filePath = resolve()
    let config = await getKeyLionConfig();
    let { defaultLanguage } = config;
    let dirs = readdirSync(SRC_DIR);
    let documents = [];
    dirs.forEach(i => {
        let fileDirs = readdirSync(resolve(SRC_DIR, i));
        fileDirs.forEach(f => {
            if (f === DOCS_DIR_NAME) {
                let docsDir = slash(resolve(SRC_DIR, i, DOCS_DIR_NAME));
                documents.push({
                    name: camelize(i),
                    path: `/${defaultLanguage}/${i}`,
                    component: `${docsDir}/${defaultLanguage}.md`
                });
            }
        });
    });
    function genImportDocuments(items) {
        return items
            .map((item) => {
            const path = slash(item.component);
            return `const ${item.name} = () => import('${path}');`;
        })
            .join('\n');
    }
    function constDocument(documents) {
        return `${genImportDocuments(documents)}`;
    }
    function exportConstDocument(documents) {
        return `export default {
            ${documents.map(i => i.name).join(",")}
        }`;
    }
    let code = `
    ${constDocument(documents)} \n
    ${exportConstDocument(documents)}

  `;
    return code;
}
