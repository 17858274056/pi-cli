import { get } from 'lodash-es';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import { html, inlineCss } from 'keylion-plugins';
import uni from '@dcloudio/vite-plugin-uni';
import { resolveDocument } from '../compiler/gen-site-desktop.js';
import Markdown from 'vite-plugin-md';
import markdownIt from 'markdown-it';
import { ES_DIR, SITE_CONFIG, SITE_DIR, SITE_PUBLIC_PATH, 
// SITE_MOBILE_ROUTES,
// SITE_OUTPUT_PATH,
// SITE_PC_ROUTES,
// SITE_PUBLIC_PATH,
VITE_RESOLVE_EXTENSIONS,
// EXTENSION_ENTRY,
 } from '../share/constant.js';
function siteDocument() {
    const virtualModule = 'keylion-site-desktop';
    const virtualModuleId = `keylion-cli:${virtualModule}`;
    return {
        name: "vite-plugins(keylion-cli)-site-desktop",
        resolveId(id) {
            if (id === virtualModule) {
                return virtualModuleId;
            }
        },
        load(id) {
            if (id === virtualModuleId) {
                return resolveDocument();
            }
        }
    };
}
function getPluginsTest() {
    return {
        name: "vite-plugin-test",
        enforce: "pre",
        transform(source, id) {
            if (!/\.md$/.test(id))
                return;
            let mdV = markdownIt({
                html: true
            }).render(source);
            return `
            <template><div class="varlet-site-doc">${mdV}</div></template>
            
            <script>
        
            export default {
              components: {
               
              }
            }
            </script>
              `;
        },
        async handleHotUpdate(ctx) {
            console.log(ctx);
        }
    };
}
export function getDevConfig(config) {
    const defualtLanguage = get(config, "defaultLanguage");
    const host = get(config, "host");
    let uniConfig = get(config, 'uniapp');
    let uLen = uniConfig.length;
    return {
        root: SITE_DIR,
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
            hmr: {
                overlay: false
            }
        },
        publicDir: SITE_PUBLIC_PATH,
        plugins: [
            siteDocument(),
            vue({
                include: [/\.vue$/, /\.md$/]
            }),
            jsx(),
            getPluginsTest(),
            Markdown(),
            uLen && uni(),
            html({
                data: {
                    logo: get(config, "logo"),
                    baidu: get(config, "analysis.baidu", ''),
                    pcTitle: get(config, `pc.title['${defualtLanguage}']`)
                }
            })
        ]
    };
}
export function getBundleConfig(keylionConfig, buildOptions) {
    const plugins = [];
    const name = get(keylionConfig, "name");
    const { fileName, output, format, emptyOutDir } = buildOptions;
    if (format === 'umd') {
        plugins.push(inlineCss({
            jsFile: resolve(output, fileName),
            cssFile: resolve(output, "style.css")
        }));
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
    };
}
