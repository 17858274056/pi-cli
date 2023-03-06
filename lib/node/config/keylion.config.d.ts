export interface keylionConfig {
    /**
 * @default `Keylion`
 * UI library name.
 */
    name?: string;
    /**
     * @default `k`
     * Component name prefix
     */
    namespace?: string;
    /**
     * @default `localhost`
     * Local dev server host
     */
    host?: string;
    /**
   * @default `8080`
   * Local dev server port
   */
    port?: number;
    title?: string;
    logo?: string;
    format: string;
    themeKey?: string;
    defaultLanguage?: 'zh-CN' | 'en-US';
    useMobile?: boolean;
    lightTheme?: Record<string, string>;
    darkTheme?: Record<string, string>;
    highlight?: {
        style: string;
    };
    analysis?: {
        baidu: string;
    };
    pc?: Record<string, any>;
    mobile?: Record<string, any>;
    uniapp?: Record<string, any>;
}
export declare function defineConfig(config: keylionConfig): keylionConfig;
export declare function getKeyLionConfig(emit?: boolean): Promise<Required<keylionConfig>>;
