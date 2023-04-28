import { createServer, ViteDevServer } from 'vite'
import chokidar, { FSWatcher } from 'chokidar'
import fse from 'fs-extra'
import { resolve } from 'path'
import { KEYLION_CONFIG, SITE } from '../share/constant.js'
import logger from '../share/logger.js'
import { getKeyLionConfig } from '../config/keylion.config.js'
import { getDevConfig } from '../config/vite.config.js'
import { buildSiteEntry } from '../compiler/compileSiteEntry.js'
import { SRC_DIR } from '../share/constant.js'
import { merge } from 'lodash-es'
let { pathExistsSync, ensureDirSync } = fse

let server: ViteDevServer
let watcher: FSWatcher
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