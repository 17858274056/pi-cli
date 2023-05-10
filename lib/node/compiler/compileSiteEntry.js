import fse from 'fs-extra';
import { DOCS_DIR_NAME, 
//   DIR_INDEX,
EXAMPLE_DIR_NAME, SITE, SITE_DIR, SRC_DIR, } from '../share/constant.js';
import { getKeyLionConfig } from '../config/keylion.config.js';
import { resolve } from 'path';
let { copy, readdir, writeFileSync, readdirSync, ensureFileSync } = fse;
export async function buildMobileSiteRoutes() {
    let routes = [];
    let fileDirs = await readdir(SRC_DIR);
    fileDirs.forEach(file => {
        let dirs = resolve(SRC_DIR, file);
        let dirsFile = readdirSync(dirs);
        if (dirsFile.includes(EXAMPLE_DIR_NAME)) {
            let examlpeFile = resolve(SRC_DIR, file, EXAMPLE_DIR_NAME, "index.vue");
            ensureFileSync(examlpeFile);
            routes.push({
                path: `/${file}`,
                component: resolve(examlpeFile)
            });
        }
    });
    let routesImport = `
    export default [
         ${routes
        .map((i) => {
        return `{
    path: '${i.path}',
    //@ts-ignore
    component: ()=>import("${i.component}"),
        },`;
    }).join("\n")}
           
    ]
 `;
    writeFileSync(resolve(SITE_DIR, "..", "mobile.routes.ts"), routesImport);
}
export async function buildUniappRoutes() {
}
export async function buildPcSiteRoutes() {
    let routes = [];
    let fileDirs = await readdir(SRC_DIR);
    fileDirs.forEach(file => {
        let dirs = resolve(SRC_DIR, file);
        let dirsFile = readdirSync(dirs);
        if (dirsFile.includes(DOCS_DIR_NAME)) {
            let localeDirs = readdirSync(resolve(dirs, DOCS_DIR_NAME));
            localeDirs.forEach(locale => {
                locale = locale.replace(".md", '');
                if (locale === 'zh-CN') {
                    routes.push({
                        path: `/${file}`,
                        component: resolve(SRC_DIR, file, DOCS_DIR_NAME, `${locale}.md`)
                    });
                }
            });
        }
    });
    let routesImport = `
    export default [
         ${routes
        .map((i) => {
        return `{
    path: '${i.path}',
    //@ts-ignore
    component: ()=>import("${i.component}"),
        },`;
    }).join("\n")}
           
    ]
 `;
    writeFileSync(resolve(SITE_DIR, "..", "pc.routes.ts"), routesImport);
}
async function buildSiteSource() {
    await copy(SITE, SITE_DIR);
}
export async function buildSiteEntry() {
    let config = await getKeyLionConfig(true);
    await Promise.all([buildMobileSiteRoutes(), buildPcSiteRoutes(), buildSiteSource()]);
    return config;
}
