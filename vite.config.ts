import { defineConfig } from "vite";

export default defineConfig({
	build: {
		ssr: true,
		target: "node24",
		rollupOptions: {
			input: "./src/index.ts",
			output: {
				format: "es",
				dir: "./dist",
				entryFileNames: "index.js",
			},
			// 不外部化任何模块，让 Vite 打包所有依赖（包括 Node.js 内置模块）
			external: () => false,
		},
	},
});
