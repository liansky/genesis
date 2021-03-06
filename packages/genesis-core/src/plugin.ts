import * as Genesis from './';
import { SSR } from './ssr';

export class Plugin {
    public ssr: SSR;
    public constructor(ssr: SSR) {
        this.ssr = ssr;
    }

    /**
     * Execute before building production environment
     */
    public beforeCompiler(type: Genesis.CompilerType) {}
    /**
     * Add plug-in of webpack or change configuration of webpack
     */
    public chainWebpack(config: Genesis.WebpackHookParams) {}
    /**
     * Execute after building production environment
     */
    public afterCompiler(type: Genesis.CompilerType) {}
    /**
     * Execute before rendering Middleware
     */
    public renderBefore(context: Genesis.RenderContext) {}
    /**
     * SSR rendering complete execution
     */
    public renderCompleted(context: Genesis.RenderContext) {}
}

export class PluginManage {
    /**
     * Current SSR instance
     */
    public ssr: Genesis.SSR;
    /**
     * List of installed plug-ins
     */
    private plugins: Genesis.Plugin[] = [];
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
    }

    /**
     * Using a plug-in for SSR
     */
    public use(P: typeof Plugin | Plugin) {
        if (P instanceof Plugin) {
            this.plugins.push(P);
        } else {
            this.plugins.push(new P(this.ssr));
        }
        return this;
    }

    /**
     * Execute the hook of a plug-in asynchronously
     */
    public callHook<T extends Exclude<keyof Plugin, 'ssr'>>(
        key: T,
        ...args: Parameters<Plugin[T]>
    ) {
        const p = Promise.resolve();
        this.plugins.forEach((plugin) => {
            p.then(() => {
                return (plugin as any)[key](...args);
            });
        });
        return p;
    }
}
