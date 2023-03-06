import { InlineConfig } from 'vite';
import type { keylionConfig } from './keylion.config.js';
export declare function getDevConfig(config: Required<keylionConfig>): InlineConfig;
export interface BundleBuildOptions {
    fileName: string;
    output: string;
    format: 'es' | 'cjs' | 'umd';
    emptyOutDir: boolean;
}
export declare function getBundleConfig(keylionConfig: Required<keylionConfig>, buildOptions: BundleBuildOptions): InlineConfig;
