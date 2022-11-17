/* @flow */
/* eslint import/no-nodejs-modules: off */

import type { WebpackConfig } from "@krakenjs/webpack-config-grumbler/index.flow";
import { getWebpackConfig } from "@krakenjs/webpack-config-grumbler";

let FILE_NAME = "cross-domain-utils";
let MODULE_NAME = "crossDomainUtils";

export let WEBPACK_CONFIG: WebpackConfig = getWebpackConfig({
  filename: `${FILE_NAME}.js`,
  modulename: MODULE_NAME,
  minify: false,
  vars: {
    __MIN__: false,
    __TEST__: false,
  },
});

export let WEBPACK_CONFIG_MIN: WebpackConfig = getWebpackConfig({
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true,
  vars: {
    __MIN__: true,
    __TEST__: false,
  },
});

export let WEBPACK_CONFIG_TEST: WebpackConfig = getWebpackConfig({
  modulename: MODULE_NAME,
  options: {
    devtool: "inline-source-map",
  },
  vars: {
    __TEST__: true,
  },
});

export default [WEBPACK_CONFIG, WEBPACK_CONFIG_MIN];
