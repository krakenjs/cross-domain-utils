/* eslint import/no-nodejs-modules: off, import/no-default-export: off, @typescript-eslint/no-unsafe-assignment: off, @typescript-eslint/no-unsafe-call: off */
import type webpack from "webpack";
// @ts-ignore
import { getWebpackConfig } from "@krakenjs/grumbler-scripts/config/webpack.config";

type WebpackConfig = webpack.Configuration;

const FILE_NAME = "cross-domain-utils";
const MODULE_NAME = "crossDomainUtils";

export const WEBPACK_CONFIG: WebpackConfig = getWebpackConfig({
  entry: "./src/index.ts",
  filename: `${FILE_NAME}.js`,
  modulename: MODULE_NAME,
  minify: false,
  vars: {
    __MIN__: false,
    __TEST__: false,
  },
});

export const WEBPACK_CONFIG_MIN: WebpackConfig = getWebpackConfig({
  entry: "./src/index.ts",
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true,
  vars: {
    __MIN__: true,
    __TEST__: false,
  },
});

export const WEBPACK_CONFIG_TEST: WebpackConfig = getWebpackConfig({
  entry: "./src/index.ts",
  modulename: MODULE_NAME,
  options: {
    devtool: "inline-source-map",
  },
  vars: {
    __TEST__: true,
  },
});

export default [WEBPACK_CONFIG, WEBPACK_CONFIG_MIN];
