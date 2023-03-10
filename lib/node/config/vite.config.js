import { get } from 'lodash-es';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import { html, inlineCss } from 'keylion-plugins';
import { resolveH5Document, resolvePCDocument, resolveConfig } from '../compiler/gen-site-desktop.js';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { ES_DIR, SITE_CONFIG, SITE_DIR, SITE_PUBLIC_PATH, 
// SITE_MOBILE_ROUTES,
// SITE_OUTPUT_PATH,
// SITE_PC_ROUTES,
// SITE_PUBLIC_PATH,
VITE_RESOLVE_EXTENSIONS,
// EXTENSION_ENTRY,
 } from '../share/constant.js';
function siteConfig() {
    const virtualModule = 'keylion-site-config';
    const virtualModuleId = `keylion-cli:${virtualModule}`;
    return {
        name: "vite-plugins(keylion-cli)-site-config",
        resolveId(id) {
            if (id === virtualModule) {
                return virtualModuleId;
            }
        },
        load(id) {
            if (id === virtualModuleId) {
                return resolveConfig();
            }
        }
    };
}
function sitePcDocument() {
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
                return resolvePCDocument();
            }
        }
    };
}
function siteH5Document() {
    const virtualModule = 'keylion-site-h5';
    const virtualModuleId = `keylion-cli:${virtualModule}`;
    return {
        name: "vite-plugins(keylion-cli)-site-h5",
        resolveId(id) {
            if (id === virtualModule) {
                return virtualModuleId;
            }
        },
        load(id) {
            if (id === virtualModuleId) {
                return resolveH5Document();
            }
        }
    };
}
function highlight(str, lang, style) {
    let link = '';
    if (style) {
        link = '<link class="hljs-style" rel="stylesheet" href="' + style + '"/>';
    }
    if (lang && hljs.getLanguage(lang)) {
        return ('<pre class="hljs"><code>' +
            link +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>');
    }
    return '';
}
function injectCodeExample(source) {
    const codeRE = /(<pre class="hljs">(.|\r|\n)*?<\/pre>)/g;
    return source.replace(codeRE, (str) => {
        const flags = [
            '// playground-ignore\n',
            '<span class="hljs-meta prompt_"># </span><span class="language-bash">playground-ignore</span>\n',
            '<span class="hljs-comment">// playground-ignore</span>\n',
            '<span class="hljs-comment">/* playground-ignore */</span>\n',
            '<span class="hljs-comment">&lt;!-- playground-ignore --&gt;</span>\n',
        ];
        const attr = flags.some((flag) => str.includes(flag)) ? "playground-ignore" : "";
        str = flags.reduce((str, flag) => str.replace(flag, ''), str);
        return `<code-example ${attr}>${str}</code-example>`;
    });
}
function markDownToParse(source, options) {
    let mdV = markdownIt({
        html: true,
        highlight: (str, lang) => highlight(str, lang)
    }).render(source);
    const hGroup = mdV.replace(/<h3/g, ":::<h3").replace(/<h2/g, ":::<h2").split(":::");
    let examCode = `
    <template><div class="keylion-site-doc">${hGroup.map(fragment => (fragment.includes("<h3") ? `<div class='card'>${fragment}</div>` : fragment)).join("")}</div></template>
    
    <script>

    export default {
  
    }
    </script>
      `;
    examCode = injectCodeExample(examCode);
    return examCode;
}
function getPluginsTest() {
    return {
        name: "vite-plugin-md",
        enforce: "pre",
        transform(source, id) {
            if (!/\.md$/.test(id))
                return;
            try {
                return markDownToParse(source);
            }
            catch (e) {
                console.error(e);
            }
        },
        async handleHotUpdate(ctx) {
            if (!/\.md$/.test(ctx.file))
                return;
            const readSource = ctx.read;
            ctx.read = async function () {
                return markDownToParse(await readSource());
            };
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
