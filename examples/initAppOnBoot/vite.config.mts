import { defineConfig } from "vite";
import { VitePluginNode } from "@jcannon98188/vite-plugin-node";

export default defineConfig({
	plugins: [
		...VitePluginNode({
			adapter: "express",
			appPath: "./app.ts",
			initAppOnBoot: true,
		}),
	],
});
