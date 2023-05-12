import fse from 'fs-extra'
import inquirer from 'inquirer'
import { resolve } from 'path'
import { execSync as exec } from 'node:child_process'
import { CWD, TEMPLATE, KEYLION_CONFIG } from "../share/constant.js"
import { nextTick } from 'process'
let {
    readFileSync,
    copy,
    writeFileSync
} = fse

export function gen() {
    inquirer.prompt([
        {
            type: "input",
            message: "请输出项目名称",
            name: "name"
        },
        {
            name: "type",
            message: "Which choice template in h5 or uniapp",
            type: "list",
            choices: [
                {
                    name: "h5",
                    value: "h5"
                },
                {
                    name: "uniapp",
                    value: "uniapp"
                }
            ]
        }
    ]).then(({ name, type }) => {
        if (name) {
            initGen(name, type)
        }
    })
}

export function initGen(name: string, type: string) {
    let packageJson, config, packages
    switch (type) {
        case "h5":
            packageJson = resolve(TEMPLATE, "./generate/base", "package.json")
            config = resolve(TEMPLATE, "./generate/base", "keylion.config.mjs")
            packages = JSON.parse(readFileSync(packageJson, {
                encoding: "utf-8"
            }))
            packages.name = name;
            writeFileSync(resolve(CWD, "package.json"), JSON.stringify(packages, null, 4))
            copy(config, KEYLION_CONFIG)
            break;
        case "uniapp":
            packageJson = resolve(TEMPLATE, "./generate/base", "uniapp-package.json")
            config = resolve(TEMPLATE, "./generate/base", "keylion-uniapp.config.mjs")
            packages = JSON.parse(readFileSync(packageJson, {
                encoding: "utf-8"
            }))
            packages.name = name;
            writeFileSync(resolve(CWD, "package.json"), JSON.stringify(packages, null, 4))
            copy(config, KEYLION_CONFIG)
            break;
    }


    nextTick(() => {
        exec("pnpm i", { stdio: "inherit" })
    })
}

