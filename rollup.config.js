import resolveNode from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

const plugins = [
  typescript({
    typescript: require("typescript"),
    tsconfigOverride: {
      compilerOptions: {
        // having this in tsconfig.json breaks allowSyntheticDefaultImports and
        // 'express' import (for server-side modules)
        module: "es2015"
      }
    }
  }),
  // resolveNode(),
  // commonjs()
];

export default [
  {
    input: "src/browser.ts",
    output: [
      {
        file: "public/bundle.js",
        format: "iife",
        name: "placeholder",
        exports: "named"
      }
    ],
    // doesn't work: https://github.com/rollup/rollup/pull/2125
    watch: { clearScreen: false },
    plugins
  }
];
