interface createOption {
    keylionCaseName: string;
    sfc: boolean;
    jsx: boolean;
    locale: boolean;
    scss: boolean;
    less: boolean;
}
export declare function create(options: createOption): Promise<false | undefined>;
export {};
