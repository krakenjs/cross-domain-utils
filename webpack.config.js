/* @flow */
/* eslint import/no-nodejs-modules: off */

import { getWebpackConfig } from 'grumbler-scripts/config/webpack.config';

let FILE_NAME = 'cross-domain-utils';
let MODULE_NAME = 'crossDomainUtils';

export let WEBPACK_CONFIG = getWebpackConfig({
    filename:   `${ FILE_NAME }.js`,
    modulename: MODULE_NAME,
    vars:       {
        __MIN__:  false,
        __TEST__: false
    }
});

export let WEBPACK_CONFIG_MIN = getWebpackConfig({
    filename:   `${ FILE_NAME }.min.js`,
    modulename: MODULE_NAME,
    minify:     true,
    vars:       {
        __MIN__:  true,
        __TEST__: false
    }
});

export let WEBPACK_CONFIG_TEST = getWebpackConfig({
    filename:   `${ FILE_NAME }.js`,
    modulename: MODULE_NAME,
    options:    {
        devtool: 'inline-source-map'
    },
    vars: {
        __TEST__: true
    }
});

export default [ WEBPACK_CONFIG, WEBPACK_CONFIG_MIN ];
