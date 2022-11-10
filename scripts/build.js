#!/usr/bin/env node

import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

[
	{ ext: "js", format: "cjs" },
	{ ext: "mjs", format: "esm" },
].forEach(({ ext, format }) =>
	esbuild.build({
		external: ["./node_modules/*"],
		format,
		sourcemap: true,
		target: "es6",
		bundle: true,
		entryPoints: ["src/index.ts"],
		external: ["./node_modules/*"],
		outfile: `index.${ext}`,
		plugins: [nodeExternalsPlugin()],
	})
);
