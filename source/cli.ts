#!/usr/bin/env node

import { monotonicFactory } from "./ulid.js";

function parseArgs(args: Array<string>): Record<string, string | boolean> {
    const output = {};

    while (args.length > 0) {
        const arg = args.shift();

        if (/^\-\-/.test(arg)) {
            if (/=/.test(arg)) {
                const [key, value] = arg.split("=");
                output[key.substring(2)] = value;
            } else {
                const value = args.shift();

                if (/^-/.test(value)) {
                    args.unshift(value);
                } else if (!value) {
                    output[arg.substring(2)] = true;
                } else {
                    output[arg.substring(2)] = value;
                }
            }
        }
    }

    return output;
}

const argv = parseArgs(process.argv.slice(2));

const count = /^\d+/.test(argv["count"] as string) ? parseInt(argv["count"] as string, 10) : 1;

const factory = monotonicFactory();

for (let i = 0; i < count; i += 1) {
    console.log(factory());
}
