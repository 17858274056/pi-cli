import { createServer, ViteDevServer } from 'vite'
import chokidar, { FSWatcher } from 'chokidar'
import fse from 'fs-extra'
import { KEYLION_CONFIG, SITE } from '../share/constant.js'
import logger from '../share/logger.js'
import { getKeyLionConfig } from '../config/keylion.config.js'
import { getDevConfig } from '../config/vite.config.js'
import { execa } from 'execa'
import { buildSiteEntry } from '../compiler/compileSiteEntry.js'
import { SRC_DIR } from '../share/constant.js'
import uni from "@dcloudio/vite-plugin-uni";
import { merge } from 'lodash-es'
import { resolve } from "path";
import { fileURLToPath } from "url";
// let __dirname = resolve(fileURLToPath(import.meta.url));
let { pathExistsSync, ensureDirSync } = fse

let server: ViteDevServer
let watcher: FSWatcher
let uniappServer: ViteDevServer
async function startUniappServer(force: boolean | undefined) {
    const isRestart = Boolean(server)
    logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`)
    server && (server.close())
    uniappServer && (uniappServer.close())
    watcher && (watcher.close())
    let devConfig = await buildSiteEntry()
    let keylionConfig = getDevConfig(devConfig)
    let initConfig = merge(keylionConfig, force ? { optimizeDeps: { force: true } } : {})
    server = await createServer(initConfig)
    // execa("node", [resolve(__dirname, "../uniapp-dev.js")]).stdout?.pipe(process.stdout)

    await server.listen()
    server.printUrls()
    if (pathExistsSync(KEYLION_CONFIG)) {
        watcher = chokidar.watch(KEYLION_CONFIG)
        watcher.on("change", () => startServer(force))
    }
    logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`)

}

async function startServer(force: boolean | undefined) {
    const isRestart = Boolean(server)
    logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`)
    server && (server.close())
    watcher && (watcher.close())

    let devConfig = await buildSiteEntry()
    let keylionConfig = getDevConfig(devConfig)
    let initConfig = merge(keylionConfig, force ? { optimizeDeps: { force: true } } : {})


    server = await createServer(initConfig)

    await server.listen()
    server.printUrls()
    if (pathExistsSync(KEYLION_CONFIG)) {
        watcher = chokidar.watch(KEYLION_CONFIG)
        watcher.on("change", () => startServer(force))
    }
    logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`)
}

interface devOption {
    force: boolean | undefined
}

export async function dev(option: devOption) {
    process.env.NODE_ENV = 'development'
    ensureDirSync(SRC_DIR)
    startServer(option.force)
}


startUniappServer(false)