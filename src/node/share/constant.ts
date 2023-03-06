import { getDirname } from "./fsUtils.js";
import { resolve } from 'path'
export const dirname = getDirname(import.meta.url);
export const CWD = process.cwd();
export const KEYLION_CONFIG = resolve(CWD, "keylion.config.mjs");
export const SRC_DIR = resolve(CWD, "views");
export const ES_DIR = resolve(CWD, "es");
export const LIB_DIR = resolve(CWD, "lib");
export const UMD_DIR = resolve(CWD, "umd");
export const TYPES_DIR = resolve(CWD, "types");
export const ROOT_DOCS_DIR = resolve(CWD, "docs");
export const ROOT_PAGES_DIR = resolve(CWD, "pages");
export const ESLINT_EXTENSIONS = [".vue", ".ts", ".js", ".mjs", ".tsx", ".jsx"];
export const FILE_EXTENSION = ['index.js', 'index.ts', 'index.mjs', 'index.cjs']
export const scriptExtNames = ['.vue', '.ts', '.tsx', '.mjs', '.js', '.jsx']
export const ignoreFile = ['utils', 'locale', "node", "client"]

export const VITE_RESOLVE_EXTENSIONS = [
    ".vue",
    ".tsx",
    ".ts",
    ".jsx",
    ".js",
    ".less",
    ".scss",
    ".css",
];
export const SCRIPTS_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
export const PUBLIC_DIR_INDEXES = [
    "index.vue",
    "index.tsx",
    "index.ts",
    "index.jsx",
    "index.js",
];
export const STYLE_DIR_NAME = "style"
export const EXAMPLE_DIR_NAME = 'example'
export const LOCALE_DIR_NAME = 'locale'
export const DOCS_DIR_NAME = 'docs'
export const TEST_DIR_NAME = '__tests__'
export const CLI_PACKAGE_JSON = resolve(dirname, '../../../package.json')
export const UI_PACKAGE_JSON = resolve(CWD, "package.json")
export const IMPORT_FROM_DEPEDENCE_RE = /import\s+[\w\s*$,{}]+from\s+(".*?"|'.*?')/g
export const EXPORT_FROM_DEPEDENCE_RE = /export\s+?[\w\s*$,{}]+from\s+(".*?"|'.*?')/g
export const IMPORT_DEPEDENCE_RE = /import\s+(".*?"|'.*?')/g

// css
export const STYLE_EXTENSIONS = ['scss', 'less', '.css']
export const STYLE_EXTENSION = ['index.css', 'index.less', '.index.scss']

export const SCSS_RE = /(?<!['"])import\s+["'](\.{1,2}\/.+\.scss)["']\s*;/g
export const CSS_RE = /(?<!['"])import\s+["'](\.{1,2}\/.+\.css)["']\s*;?/g
export const LESS_RE = /(?<!['"])import\s+["'](\.{1,2}\/.+\.less)["']\s*;/g
export const STYLE_IMPORT_RE = /@import\s+['"](.+)['"]\s*;/g

// js





// site


export const SITE = resolve(dirname, '../../../site')
export const SITE_PUBLIC_PATH = resolve(CWD, "public")
export const SITE_CONFIG = resolve(CWD, ".keylion/site.config.json")
export const SITE_DIR = resolve(CWD, '.keylion/site')







