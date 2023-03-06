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
    //   SITE_MOBILE_ROUTES,
    //   SITE_PC_DIR,
    //   SITE_PC_ROUTES,
    SRC_DIR,
} from '../share/constant.js'
import { glob, isDir, outputFileSyncOnChange } from '../share/fsUtils.js'
import { getKeyLionConfig } from '../config/keylion.config.js'
import { get } from 'lodash-es'

let { copy } = fse

console.log(SITE)

// export async function 


async function buildSiteSource() {
    await copy(SITE, SITE_DIR)
}

export async function buildSiteEntry() {
    let config = await getKeyLionConfig(true)
    await Promise.all([buildSiteSource()])
    // await Promise.all([buildMobileSiteRoutes(), buildPcSiteRoutes(), buildSiteSource()])

    return config
}
