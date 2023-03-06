import { KEYLION_CONFIG, SITE_CONFIG } from './../share/constant.js';
import fse from 'fs-extra'
import { mergeWith } from 'lodash-es'
import { outputFileSyncOnChange } from '../share/fsUtils.js'
import { isArray } from 'keylion-share'
import { pathToFileURL } from 'url'

const { pathExistsSync, statSync } = fse


export interface keylionConfig {
    /**
 * @default `Keylion`
 * UI library name.
 */
    name?: string
    /**
     * @default `k`
     * Component name prefix
     */
    namespace?: string
    /**
     * @default `localhost`
     * Local dev server host
     */

    host?: string

    /**
   * @default `8080`
   * Local dev server port
   */
    port?: number
    title?: string
    logo?: string
    format: string
    themeKey?: string
    defaultLanguage?: 'zh-CN' | 'en-US'
    useMobile?: boolean
    lightTheme?: Record<string, string>
    darkTheme?: Record<string, string>
    highlight?: { style: string }
    analysis?: { baidu: string }
    pc?: Record<string, any>
    mobile?: Record<string, any>
    uniapp?: Record<string, any>


}

export function defineConfig(config: keylionConfig) {
    return config
}

export async function getKeyLionConfig(emit: boolean = false): Promise<Required<keylionConfig>> {
    const defaultConfig = (await import("./keylion.default.config.js")).default
    const config: any = pathExistsSync(KEYLION_CONFIG) ? (await import(`${pathToFileURL(KEYLION_CONFIG).href}?_t=${statSync(KEYLION_CONFIG).mtimeMs}`)).default : {}
    // 这为啥需要这么大费周章的去读import 为了防止缓存，所以手动撸了一个_t
    const mergedConfig = mergeWith(defaultConfig, config) // 暂定 后续需要处理 pc、mobile 内特定参数

    if (emit) {
        const source = JSON.stringify(mergedConfig, null, 2)
        outputFileSyncOnChange(SITE_CONFIG, source)
    }

    return mergedConfig
}