import { defineConfig } from "vite";
import { VitePluginNode } from "@jcannon98188/vite-plugin-node";

export default defineConfig({
	plugins: [
		...VitePluginNode({
			adapter: "nest",
			appPath: "./src/main.ts",
			tsCompiler: "swc",
		}),
	],
});
