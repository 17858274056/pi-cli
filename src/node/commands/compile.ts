import fse from "fs-extra"
import { SRC_DIR, ES_DIR, UMD_DIR, LIB_DIR } from '../share/constant.js'
import ora from 'ora'
import { compileBundle, compileMoudle } from '../compiler/compileModule.js'
let { readdir, ensureDir, remove } = fse



function removeDir() {
    return Promise.all([remove(ES_DIR), remove(UMD_DIR), remove(LIB_DIR)])
}

const dest = readdir(SRC_DIR)


export async function runTask(taskName: string, task: () => any) {
    const s = ora().start(`Compiling ${taskName}`)
    try {
        await task()
        s.succeed(`Compilation ${taskName} completed!`)
    } catch (e: any) {
        s.fail(`Compilation ${taskName} failed!`)
        console.error(e.toString())
    }
}



export async function compile() {
    process.env.NODE_ENV = 'compile'
    await removeDir()

    process.env.BABEL_MODULE = 'module';
    await runTask("moudle", compileMoudle)
    process.env.BABEL_MODULE = ''
    await runTask("bundle", compileBundle)
}
