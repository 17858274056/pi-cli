import globSync from 'glob'
import fse from 'fs-extra'
import { extname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { CLI_PACKAGE_JSON, PUBLIC_DIR_INDEXES, SCRIPTS_EXTENSIONS, SRC_DIR, UI_PACKAGE_JSON } from './constant.js'

const {
    appendFileSync,
    ensureFileSync,
    lstatSync,
    outputFileSync,
    pathExistsSync,
    readdir,
    readFileSync,
    readJSONSync,
} = fse;
export const JSX_REGEXP = /\.(j|t)sx$/;


export function getVersion() {
    return readJSONSync(UI_PACKAGE_JSON).version
}

export const isMD = (file: string): boolean => pathExistsSync(file) && extname(file) === '.md'

export const isDir = (file: string): boolean => pathExistsSync(file) && lstatSync(file).isDirectory()

export const isSFC = (file: string): boolean => pathExistsSync(file) && extname(file) === '.vue'

export const isDTS = (file: string): boolean => pathExistsSync(file) && file.endsWith('.d.ts')

export const isScript = (file: string): boolean => pathExistsSync(file) && SCRIPTS_EXTENSIONS.includes(extname(file))

export const isLess = (file: string): boolean => pathExistsSync(file) && extname(file) === '.less'

export const isScss = (file: string): boolean => pathExistsSync(file) && extname(file) === '.scss'

export const isJsx = (path: string) => JSX_REGEXP.test(path);

export const replaceExt = (file: string, ext: string) => file.replace(extname(file), ext)

export const getPublicDirs = async (): Promise<string[]> => {
    const srcDir: string[] = await readdir(SRC_DIR)
    return srcDir.filter((filename) => isPublicDir(resolve(SRC_DIR, filename)))
}


// 补充react 与 uniapp

// export const
export const isPublicDir = (dir: string): boolean =>
    PUBLIC_DIR_INDEXES.some((index) => pathExistsSync(resolve(dir, index)))


export function glob(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        globSync(pattern, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}




export function getDirname(url: string) {
    return fileURLToPath(new URL('.', url))
}

export function getCliVersion() {
    return readJSONSync(CLI_PACKAGE_JSON).version
}

export function outputFileSyncOnChange(path: string, code: string) { // 比对文件内容，不一样则写入
    ensureFileSync(path)
    const content = readFileSync(path, 'utf-8')

    if (code !== content) {
        outputFileSync(path, code)
    }
}

export function getCliMode() { // 获取代码模版模式
    return readJSONSync(CLI_PACKAGE_JSON)?.mode ?? "vue"

}