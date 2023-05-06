import fse from 'fs-extra';
import inquirer from 'inquirer';
import { resolve } from 'path';
import { execSync as exec } from 'node:child_process';
import { CWD, TEMPLATE, KEYLION_CONFIG } from "../share/constant.js";
import { nextTick } from 'process';
let { readFileSync, copy, writeFileSync } = fse;
export function gen() {
    inquirer.prompt([
        {
            type: "input",
            message: "请输出项目名称",
            name: "name"
        }
    ]).then(({ name }) => {
        if (name) {
            initGen(name);
        }
    });
}
export function initGen(name) {
    let packageJson = resolve(TEMPLATE, "./generate/base", "package.json");
    let config = resolve(TEMPLATE, "./generate/base", "keylion.config.mjs");
    let packages = JSON.parse(readFileSync(packageJson, {
        encoding: "utf-8"
    }));
    packages.name = name;
    writeFileSync(resolve(CWD, "package.json"), JSON.stringify(packages, null, 4));
    copy(config, KEYLION_CONFIG);
    nextTick(() => {
        exec("pnpm i", { stdio: "inherit" });
    });
}
