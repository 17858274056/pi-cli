import { KEYLION_CONFIG, SITE_CONFIG } from './../share/constant.js';
import fse from 'fs-extra';
import { mergeWith } from 'lodash-es';
import { outputFileSyncOnChange } from '../share/fsUtils.js';
import { pathToFileURL } from 'url';
const { pathExistsSync, statSync } = fse;
export function defineConfig(config) {
    return config;
}
export async function getKeyLionConfig(emit = false) {
    const defaultConfig = (await import("./keylion.default.config.js")).default;
    const config = pathExistsSync(KEYLION_CONFIG) ? (await import(`${pathToFileURL(KEYLION_CONFIG).href}?_t=${statSync(KEYLION_CONFIG).mtimeMs}`)).default : {};
    // 这为啥需要这么大费周章的去读import 为了防止缓存，所以手动撸了一个_t
    const mergedConfig = mergeWith(defaultConfig, config); // 暂定 后续需要处理 pc、mobile 内特定参数
    if (emit) {
        const source = JSON.stringify(mergedConfig, null, 2);
        outputFileSyncOnChange(SITE_CONFIG, source);
    }
    return mergedConfig;
}
