import { createServer } from 'vite';
import chokidar from 'chokidar';
import fse from 'fs-extra';
import { KEYLION_CONFIG } from '../share/constant.js';
import logger from '../share/logger.js';
import { getDevConfig } from '../config/vite.config.js';
import { buildSiteEntry } from '../compiler/compileSiteEntry.js';
import { SRC_DIR } from '../share/constant.js';
import { merge } from 'lodash-es';
let { pathExistsSync, ensureDirSync } = fse;
let server;
let watcher;
async function startServer(force) {
    const isRestart = Boolean(server);
    logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`);
    server && (server.close());
    watcher && (watcher.close());
    let devConfig = await buildSiteEntry();
    let keylionConfig = getDevConfig(devConfig);
    let initConfig = merge(keylionConfig, force ? { optimizeDeps: { force: true } } : {});
    server = await createServer(initConfig);
    await server.listen();
    server.printUrls();
    if (pathExistsSync(KEYLION_CONFIG)) {
        watcher = chokidar.watch(KEYLION_CONFIG);
        watcher.on("change", () => startServer(force));
    }
    logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`);
}
export async function dev(option) {
    process.env.NODE_ENV = 'development';
    ensureDirSync(SRC_DIR);
    startServer(option.force);
}
