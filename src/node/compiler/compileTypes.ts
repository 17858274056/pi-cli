import fse from 'fs-extra'
import { resolve, relative } from 'path'
import { TYPES_DIR } from '../share/constant.js'
let { writeFileSync } = fse

export function generateReference(moduleDir: string) {
    writeFileSync(
        resolve(moduleDir, 'index.d.ts'),
        `\
  export * from '${relative(moduleDir, TYPES_DIR)}'
  `
    )
}