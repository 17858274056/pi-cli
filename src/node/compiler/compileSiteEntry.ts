import slash from 'slash'
import fse from 'fs-extra'
import {
    DOCS_DIR_NAME,
    //   DIR_INDEX,
    EXAMPLE_DIR_NAME,
    LOCALE_DIR_NAME,
    ROOT_DOCS_DIR,
    ROOT_PAGES_DIR,
    SITE,
    SITE_DIR,
    SRC_DIR,
} from '../share/constant.js'

import { glob, isDir, outputFileSyncOnChange } from '../share/fsUtils.js'
import { getKeyLionConfig } from '../config/keylion.config.js'
import { get } from 'lodash-es'
import { resolve } from 'path'
let { copy, readdir, writeFileSync, readdirSync, ensureFileSync } = fse

interface routes {
    path: string
    component: any
    children?: routes[]
}


export async function buildMobileSiteRoutes() { // 编译生成 keylion.mobile.routes.js  文件取于example

    let routes: routes[] = []

    let fileDirs = await readdir(SRC_DIR)
    fileDirs.forEach(file => {
        let dirs = resolve(SRC_DIR, file)
        let dirsFile = readdirSync(dirs)
        if (dirsFile.includes(EXAMPLE_DIR_NAME)) {
            let examlpeFile = resolve(SRC_DIR, file, EXAMPLE_DIR_NAME, "index.vue")
            ensureFileSync(examlpeFile)
            routes.push({
                path: `/${file}`,
                component: resolve(examlpeFile)
            })
        }
    })
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

    writeFileSync(resolve(SITE_DIR, "..", "mobile.routes.ts"), routesImport)

}


export async function buildPcSiteRoutes() { // 编译生成keylion.pc.routes.js  文件取于 docs
    let routes: routes[] = []

    let fileDirs = await readdir(SRC_DIR)
    fileDirs.forEach(file => {
        let dirs = resolve(SRC_DIR, file)
        let dirsFile = readdirSync(dirs)
        if (dirsFile.includes(DOCS_DIR_NAME)) {
            let localeDirs = readdirSync(resolve(dirs, DOCS_DIR_NAME))
            localeDirs.forEach(locale => {
                locale = locale.replace(".md", '')
                if (locale === 'zh-CN') {
                    routes.push({
                        path: `/${file}`,
                        component: resolve(SRC_DIR, file, DOCS_DIR_NAME, `${locale}.md`)
                    })
                }
            })

        }
    })

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
    writeFileSync(resolve(SITE_DIR, "..", "pc.routes.ts"), routesImport)
}


async function buildSiteSource() {
    await copy(SITE, SITE_DIR)
}

export async function buildSiteEntry() {
    let config = await getKeyLionConfig(true)
    await Promise.all([buildMobileSiteRoutes(), buildPcSiteRoutes(), buildSiteSource()])

    return config
}
