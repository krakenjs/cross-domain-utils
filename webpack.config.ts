import { getWebpackConfig } from "@krakenjs/webpack-config-grumbler";

const FILE_NAME = "cross-domain-utils";
const MODULE_NAME = "crossDomainUtils";

export const WEBPACK_CONFIG = getWebpackConfig({
  entry: "./src/index.ts",
  filename: `${FILE_NAME}.js`,
  modulename: MODULE_NAME,
  minify: false,
  vars: {
    __MIN__: false,
    __TEST__: false,
  },
});

export const WEBPACK_CONFIG_MIN = getWebpackConfig({
  entry: "./src/index.ts",
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true,
  vars: {
    __MIN__: true,
    __TEST__: false,
  },
});

export const WEBPACK_CONFIG_TEST = getWebpackConfig({
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
