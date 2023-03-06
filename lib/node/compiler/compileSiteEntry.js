import fse from 'fs-extra';
import { SITE, SITE_DIR, } from '../share/constant.js';
import { getKeyLionConfig } from '../config/keylion.config.js';
let { copy } = fse;
console.log(SITE);
// export async function 
async function buildSiteSource() {
    await copy(SITE, SITE_DIR);
}
export async function buildSiteEntry() {
    let config = await getKeyLionConfig(true);
    await Promise.all([buildSiteSource()]);
    // await Promise.all([buildMobileSiteRoutes(), buildPcSiteRoutes(), buildSiteSource()])
    return config;
}
