import fse from 'fs-extra';
import { SRC_DIR, dirname, STYLE_EXTENSIONS, DOCS_DIR_NAME } from '../share/constant.js';
import ejs from 'ejs';
import { resolve } from 'path';
import { getCliMode, glob } from '../share/fsUtils.js';
import logger from '../share/logger.js';
import inquirer from 'inquirer';
import { getKeyLionConfig } from '../config/keylion.config.js';
import { get } from 'lodash-es';
import { camelize, kebabCase, bigCamelize } from 'keylion-share';
let { copySync, readFileSync, writeFileSync, removeSync, pathExistsSync } = fse;
function removeExtraStyle(templates, cssStyle) {
    STYLE_EXTENSIONS.filter(c => c != cssStyle).map(i => {
        let k = templates.findIndex(f => f.includes(i));
        if (k > -1) {
            removeSync(templates[k]);
            templates.splice(k, 1);
        }
    });
}
async function templateRender(path, componentName, renderData) {
    let templates = await glob(`${path}/**/*.ejs`);
    removeExtraStyle(templates, renderData.styleCss);
    templates.forEach(item => {
        const templateCode = readFileSync(item, "utf-8");
        let code = ejs.render(templateCode, renderData);
        const file = item.replace("[componentName]", camelize(componentName))
            .replace("[ComponentName]", bigCamelize(componentName))
            .replace(".ejs", "");
        writeFileSync(file, code);
        console.log(file);
        removeSync(item);
    });
}
export async function create(options) {
    var _a;
    let namespace = (_a = get(getKeyLionConfig(), "namespace")) !== null && _a !== void 0 ? _a : '';
    let renderData = {
        namespace,
        styleCss: "scss",
        bigCamelizeNamespace: bigCamelize(namespace),
        kebabCaseName: "component-name",
        bigCamelizeName: "ComponentName",
        camelizeName: "componentName",
        style: "vue"
    };
    let { keylionCaseName } = options.keylionCaseName ? options : await inquirer.prompt([
        {
            name: "keylionCaseName",
            type: "input",
            message: "component name"
        }
    ]);
    renderData.kebabCaseName = kebabCase(keylionCaseName); // component-name
    renderData.camelizeName = camelize(keylionCaseName); // componentName
    renderData.bigCamelizeName = bigCamelize(keylionCaseName); //ComponentName
    const fileComponentName = resolve(SRC_DIR, renderData.kebabCaseName);
    const componentName = renderData.kebabCaseName;
    if (pathExistsSync(fileComponentName)) {
        logger.error(`${componentName} already exist`);
        return false;
    }
    if (options.sfc || options.jsx) {
        renderData.style = options.sfc ? "vue " : "jsx";
    }
    else {
        const { style } = await inquirer.prompt([
            {
                name: "style",
                type: "list",
                message: "Which choice style in vue or tsx",
                choices: [
                    {
                        name: "sfc",
                        value: "vue"
                    },
                    {
                        name: "jsx",
                        value: "tsx"
                    }
                ]
            }
        ]);
        renderData.style = style;
    }
    if (options.scss || options.less) {
        renderData.styleCss = options.scss ? "scss" : "less";
    }
    else {
        let { cssStyle } = await inquirer.prompt([
            {
                name: "cssStyle",
                message: "which Choice cssStyle",
                type: "list",
                choices: [
                    {
                        name: "scss",
                        value: "scss"
                    },
                    {
                        name: "less",
                        value: "less"
                    }
                ]
            }
        ]);
        renderData.styleCss = cssStyle;
    }
    if (!options.locale) {
        let { locale } = await inquirer.prompt({
            name: "locale",
            type: "confirm",
            message: "Whether to use i18n",
            default: false
        });
        if (!locale)
            removeSync(resolve(fileComponentName, DOCS_DIR_NAME));
    }
    copySync(resolve(dirname, `../../../template/create/${getCliMode()}`), fileComponentName);
    await templateRender(fileComponentName, componentName, renderData);
    if (renderData.style !== 'vue') {
        removeSync(resolve(fileComponentName, `${renderData.bigCamelizeName}.vue`));
    }
    if (renderData.style !== 'tsx') {
        removeSync(resolve(fileComponentName, `${renderData.bigCamelizeName}.tsx`));
    }
}
