import fse from "fs-extra"
import { resolve } from 'path'
import { SRC_DIR, SITE_OUTPUT_PATH, SITE_DIR } from '../share/constant.js'
import { buildSiteEntry } from '../compiler/compileSiteEntry.js'
import { getKeyLionConfig } from '../config/keylion.config.js'
import { build as siteBuild } from 'vite'
import { getDevConfig } from '../config/vite.config.js'

let { ensureDirSync } = fse

export async function build() {
    process.env.NODE_ENV = 'production'

    ensureDirSync(SRC_DIR)
    await buildSiteEntry();

    let config = await getKeyLionConfig();

    await siteBuild({
        ...getDevConfig(config),
        build: {
            outDir: SITE_OUTPUT_PATH,
            reportCompressedSize: false,
            emptyOutDir: true,
            cssTarget: 'chrome61',
            rollupOptions: {
                input: {
                    main: resolve(SITE_DIR, 'index.html'),
                    mobile: resolve(SITE_DIR, 'mobile.html'),
                },
            },
        },
    })


}