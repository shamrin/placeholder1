import resolveNode from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

const plugins = [resolveNode(), commonjs()];

export default [
  {
    input: "dist/browser.js",
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
