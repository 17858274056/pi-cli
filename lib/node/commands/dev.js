import { createServer } from 'vite';
import chokidar from 'chokidar';
import fse from 'fs-extra';
import { KEYLION_CONFIG } from '../share/constant.js';
import logger from '../share/logger.js';
import { getDevConfig } from '../config/vite.config.js';
import { execa } from 'execa';
import { buildSiteEntry } from '../compiler/compileSiteEntry.js';
import { SRC_DIR } from '../share/constant.js';
import { merge } from 'lodash-es';
import { resolve } from "path";
import { fileURLToPath } from "url";
let __dirname = resolve(fileURLToPath(import.meta.url));
let { pathExistsSync, ensureDirSync } = fse;
let server;
let watcher;
let uniappServer;
async function startUniappServer(force) {
    var _a;
    const isRestart = Boolean(server);
    logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`);
    server && (server.close());
    uniappServer && (uniappServer.close());
    watcher && (watcher.close());
    let devConfig = await buildSiteEntry();
    let keylionConfig = getDevConfig(devConfig);
    let initConfig = merge(keylionConfig, force ? { optimizeDeps: { force: true } } : {});
    server = await createServer(initConfig);
    (_a = execa("node", [resolve(__dirname, "../uniapp-dev.js")]).stdout) === null || _a === void 0 ? void 0 : _a.pipe(process.stdout);
    await server.listen();
    server.printUrls();
    if (pathExistsSync(KEYLION_CONFIG)) {
        watcher = chokidar.watch(KEYLION_CONFIG);
        watcher.on("change", () => startServer(force));
    }
    logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`);
}
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
startUniappServer(false);
