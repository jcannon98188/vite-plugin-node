import type { Plugin, UserConfig } from "vite";
import { PLUGIN_NAME, type VitePluginNodeConfig } from "./index.js";
import { RollupPluginSwc } from "./rollup-plugin-swc.js";
import { createMiddleware } from "./server/index.js";
import mergeDeep from "./utils.js";

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin[] {
	const swcOptions = mergeDeep(
		{
			module: {
				type: "es6",
			},
			jsc: {
				target: "es2019",
				parser: {
					syntax: "typescript",
					decorators: true,
				},
				transform: {
					legacyDecorator: true,
					decoratorMetadata: true,
				},
			},
		},
		cfg.swcOptions ?? {},
	);

	const config: VitePluginNodeConfig = {
		appPath: cfg.appPath,
		adapter: cfg.adapter,
		appName: cfg.appName ?? "app",
		tsCompiler: cfg.tsCompiler ?? "swc",
		exportName: cfg.exportName ?? "viteNodeApp",
		initAppOnBoot: cfg.initAppOnBoot ?? false,
		outputFormat: cfg.outputFormat ?? "module",
		swcOptions,
	};

	const plugins: Plugin[] = [
		{
			name: PLUGIN_NAME,
			config: () => {
				const plugincConfig: UserConfig & {
					VitePluginNodeConfig: VitePluginNodeConfig;
				} = {
					build: {
						ssr: config.appPath,
						rollupOptions: {
							input: config.appPath,
							output: {
								format: config.outputFormat,
							},
						},
					},
					server: {
						hmr: false,
					},
					optimizeDeps: {
						noDiscovery: true,
						// Vite does not work well with optionnal dependencies,
						// mark them as ignored for now
						exclude: ["@swc/core"],
					},
					VitePluginNodeConfig: config,
				};

				if (config.tsCompiler === "swc") plugincConfig.esbuild = false;

				return plugincConfig;
			},
			configureServer: async (server) => {
				server.middlewares.use(await createMiddleware(server));
			},
		},
	];

	if (config.tsCompiler === "swc") {
		if (!config.swcOptions) {
			throw new Error("swcOptions is required when using swc as tsCompiler");
		}
		plugins.push({
			...RollupPluginSwc(config.swcOptions),
		});
	}

	return plugins;
}
