import Genesis from '@fmfe/genesis-core';
import { BaseConfig } from './base';

export class ClientConfig extends BaseConfig {
    public constructor(ssr: Genesis.SSR) {
        super(ssr, 'client');
        this.config
            .entry('app')
            .add(this.ssr.entryClientFile)
            .end();
        this.config.output
            .path(this.ssr.outputDirInClient)
            .filename(
                this.ssr.isProd
                    ? 'js/[name].[contenthash:8].js'
                    : 'js/[name].js'
            );
        this.config.optimization.splitChunks(false as any);
        this.config.optimization.runtimeChunk({
            name: 'runtime'
        });
        this.config.output.jsonpFunction(
            `webpack_jsonp_${this.ssr.name.replace(/[^A-z]/g, '_')}`
        );
    }
}
