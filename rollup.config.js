import { builtinModules } from "node:module";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import pkg from "./package.json" with { type: "json" };

const EXTENSIONS = [".js", ".ts"];
const ENV = process.env.ENV ? process.env.ENV : "node";
const FMT = process.env.FMT ? process.env.FMT : "esm";

const entry = ENV === "cli" ? "source/cli.ts" : "source/index.ts";
const output = ENV === "cli" ? "dist" : `dist/${ENV}`;

const plugins = [
    typescript({
        tsconfig: "tsconfig.json"
    }),
    resolve({ extensions: EXTENSIONS })
];
if (ENV !== "node") {
    plugins.unshift(
        alias({
            entries: [{ find: "node:crypto", replacement: "./stub.js" }]
        })
    );
}
const extension = FMT === "cjs" ? "cjs" : "js";
const externals =
    FMT === "esm"
        ? [...builtinModules, ...(pkg.dependencies ? Object.keys(pkg.dependencies) : [])]
        : [...builtinModules];

export default {
    external: externals,
    input: entry,
    output: [
        {
            dir: output,
            format: FMT,
            entryFileNames: `[name].${extension}`
        }
    ],
    plugins
};
