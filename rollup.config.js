import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";

const EXTENSIONS = [".js", ".ts"];
const ENV = process.env.ENV ? process.env.ENV : "default";
const FMT = process.env.FMT ? process.env.FMT : "esm";

const entry = ENV === "cli" ? "source/cli.ts" : "source/index.ts";
const output = "dist";

const plugins = [
    typescript({
        tsconfig: "tsconfig.json"
    }),
    resolve({ extensions: EXTENSIONS })
];
const extension = FMT === "cjs" ? "cjs" : "js";

export default {
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
