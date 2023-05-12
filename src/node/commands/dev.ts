import { createServer, ViteDevServer, type InlineConfig } from 'vite'
import chokidar, { FSWatcher } from 'chokidar'
import fse, { remove } from 'fs-extra'
import { KEYLION_CONFIG, SITE, SITE_DIR } from '../share/constant.js'
import logger from '../share/logger.js'
import { getDevConfig } from '../config/vite.config.js'
import { execa } from 'execa'
import { buildSiteEntry } from '../compiler/compileSiteEntry.js'
import { SRC_DIR } from '../share/constant.js'
import { merge } from 'lodash-es'
import { resolve } from "path";
import { fileURLToPath } from "url";
let __dirname = resolve(fileURLToPath(import.meta.url));
let { pathExistsSync, ensureDirSync } = fse

let server: ViteDevServer
let watcher: FSWatcher
let uniappServer: ViteDevServer
let killEvnet: () => void
// async function startUniappServer(force: boolean | undefined) {
//     const isRestart = Boolean(server)
//     logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`)
//     server && (server.close())
//     uniappServer && (uniappServer.close())
//     watcher && (watcher.close())
//     let devConfig = await buildSiteEntry()
//     let keylionConfig = getDevConfig(devConfig)
//     let initConfig = merge(keylionConfig, force ? { optimizeDeps: { force: true } } : {})
//     // 先运行完上面的vite server 不能交叉 ,换思路，先让进程的先跑，然后liste完之后丢出信息主进程再跑8080的

// }

function uniServer(initConfig: InlineConfig, force: boolean | undefined, isRestart: boolean) {

    // process.nextTick(() => {
    let { kill, stdout, stderr } = execa("node", [resolve(__dirname, "../uniapp-dev.js")], {
    })

    stdout?.on("data", async (msg) => {
        let message = msg.toString() as string
        // console.log(message)
        if (message.includes("success")) {
            server = await createServer(initConfig)
            await server.listen()
            server.printUrls()
            logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`)
        }
        if (message.includes("error")) {
            logger.error(message)
        }
    })
    killEvnet = kill
    // stdout?.pipe(process.stdout)
    // })
    if (pathExistsSync(KEYLION_CONFIG)) {
        watcher = chokidar.watch(KEYLION_CONFIG)
        watcher.on("change", () => {
            killEvnet && killEvnet()
            startServer(force)
        })
    }
}

async function h5Serve(initConfig: InlineConfig, force: boolean | undefined) {
    const isRestart = Boolean(server)
    logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`)
    server && (server.close())
    watcher && (watcher.close())

    server = await createServer(initConfig)

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
    uniappServer && (uniappServer.close())
    watcher && (watcher.close())
    let devConfig = await buildSiteEntry()
    let keylionConfig = getDevConfig(devConfig)
    let initConfig = merge(keylionConfig, force ? { optimizeDeps: { force: true } } : {})
    if (devConfig.uniapp.open) {
        uniServer(initConfig, force, isRestart)
        remove(resolve(SITE_DIR, "./h5"))
    } else {
        h5Serve(initConfig, force)
        remove(resolve(SITE_DIR, "uniapp"))
    }
}

interface devOption {
    force: boolean | undefined
}

export async function dev(option: devOption) {
    process.env.NODE_ENV = 'development'
    ensureDirSync(SRC_DIR)
    startServer(option.force)
    // startUniappServer(option.force)
}

// export async function uniappDev(option: devOption) {
//     process.env.NODE_ENV = 'development'
//     ensureDirSync(SRC_DIR)
//     // startServer(option.force)
//     startUniappServer(option.force)
// }
