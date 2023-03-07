import { get } from 'lodash-es'
import { resolve } from 'path'
import { InlineConfig } from 'vite'
import type { keylionConfig } from './keylion.config.js'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { html, inlineCss } from 'keylion-plugins'
import uni from '@dcloudio/vite-plugin-uni'
import { resolveH5Document, resolvePCDocument, resolveConfig } from '../compiler/gen-site-desktop.js'
import markdownIt from 'markdown-it'

import {
    ES_DIR,
    SITE_CONFIG,
    SITE_DIR,
    SITE_PUBLIC_PATH,
    // SITE_MOBILE_ROUTES,
    // SITE_OUTPUT_PATH,
    // SITE_PC_ROUTES,
    // SITE_PUBLIC_PATH,
    VITE_RESOLVE_EXTENSIONS,
    // EXTENSION_ENTRY,
} from '../share/constant.js'


function siteConfig() {
    const virtualModule = 'keylion-site-config'
    const virtualModuleId = `keylion-cli:${virtualModule}`
    return {
        name: "vite-plugins(keylion-cli)-site-config",
        resolveId(id: string) {
            if (id === virtualModule) {
                return virtualModuleId
            }

        },
        load(id: string) {
            if (id === virtualModuleId) {
                return resolveConfig()
            }
        }
    }
}

function sitePcDocument() {
    const virtualModule = 'keylion-site-desktop'
    const virtualModuleId = `keylion-cli:${virtualModule}`
    return {
        name: "vite-plugins(keylion-cli)-site-desktop",
        resolveId(id: string) {
            if (id === virtualModule) {
                return virtualModuleId
            }

        },
        load(id: string) {
            if (id === virtualModuleId) {
                return resolvePCDocument()
            }
        }
    }
}

function siteH5Document() {
    const virtualModule = 'keylion-site-h5'
    const virtualModuleId = `keylion-cli:${virtualModule}`
    return {
        name: "vite-plugins(keylion-cli)-site-h5",
        resolveId(id: string) {
            if (id === virtualModule) {
                return virtualModuleId
            }

        },
        load(id: string) {
            if (id === virtualModuleId) {
                return resolveH5Document()
            }
        }
    }
}


function getPluginsTest() {
    return {
        name: "vite-plugin-md",
        enforce: "pre",
        transform(source: string, id: string) {
            if (!/\.md$/.test(id)) return
            let mdV = markdownIt({
                // html: true
            }).render(source)

            return `
            <template><div class="varlet-site-doc">${mdV}</div></template>
            
            <script>
        
            export default {
          
            }
            </script>
              `
        }
    }
}


export function getDevConfig(config: Required<keylionConfig>): InlineConfig {
    const defualtLanguage = get(config, "defaultLanguage")
    const host = get(config, "host")
    let uniConfig = get(config, 'uniapp')
    let uLen = uniConfig.length
    return {
        root: SITE_DIR, // 项目根目录
        resolve: {
            extensions: VITE_RESOLVE_EXTENSIONS,
            alias: {
                "@config": SITE_CONFIG
                //后续还需要定义uniapp的快捷获取方式

            }
        },
        server: {
            host: host === 'localhost' ? '0.0.0.0' : host,
            port: get(config, 'port'),
            hmr: true
        },
        publicDir: SITE_PUBLIC_PATH,
        plugins: [
            sitePcDocument(),
            siteH5Document(),
            siteConfig(),
            vue({
                include: [/\.vue$/, /\.md$/]
            }),
            jsx(),
            // @ts-ignore
            getPluginsTest(),
            html({
                data: {
                    logo: get(config, "logo"),
                    baidu: get(config, "analysis.baidu", ''),
                    pcTitle: get(config, `pc.title['${defualtLanguage}']`)
                }
            })
        ]
    }
}

export interface BundleBuildOptions {
    fileName: string
    output: string
    format: 'es' | 'cjs' | 'umd'
    emptyOutDir: boolean
}


export function getBundleConfig(keylionConfig: Required<keylionConfig>, buildOptions: BundleBuildOptions): InlineConfig {
    const plugins = []
    const name = get(keylionConfig, "name")

    const { fileName, output, format, emptyOutDir } = buildOptions

    if (format === 'umd') {
        plugins.push(
            inlineCss({
                jsFile: resolve(output, fileName),
                cssFile: resolve(output, "style.css")
            })
        )
    }
    return {
        logLevel: 'silent',

        build: {
            minify: format === 'cjs' ? false : 'esbuild',
            emptyOutDir,
            copyPublicDir: false,
            lib: {
                name,
                formats: [format],
                fileName: () => fileName,
                entry: resolve(ES_DIR, 'index.bundle.mjs'),
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    dir: output,
                    exports: 'named',
                    globals: {
                        vue: 'Vue',
                    },
                },
            },
        },
    }
}