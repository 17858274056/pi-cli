#!/usr/bin/env node
import cac from 'cac'
import { getCliVersion } from './share/fsUtils.js'

const program = cac()

program
    .command("dev")
    .option('-f ,--force <force>', "设置为 true 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖。")
    .action(async (options) => {
        let { dev } = await import("./commands/dev.js")
        dev(options)
    })

program.command("create")
    .option("-n --name <keylionCaseName>", 'Component Name')
    .option("-s --sfc <sfc>", 'Gen SFC')
    .option("-j --jsx <jsx>", "Gen JSX")
    .option("-l --locale <locale>", "Gen i18")
    .option("--scss", "Gen Scss")
    .option("--less", "Gen less")
    .action(async (options) => {
        let { create } = await import("./commands/create.js")
        create(options)
    })

program.command("compile")
    .action(async () => {
        const { compile } = await import("./commands/compile.js")
        compile()
    })

program.command("build:vite")
    .action(async () => {
        const { build } = await import("./commands/build.js")
        await build()
    })

program.help()
program.version(getCliVersion())
program.parse()
