const path = require('path');
const argv = require('yargs').argv;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');


let FILE_NAME = 'cross-domain-utils';
let MODULE_NAME = 'crossDomainUtils';

export let defaultWebpackConfig = {
    stats: process.env.NODE_ENV === 'debug' ? "verbose" : "normal",
    bail: true,
    entry: './src/index.js',
    module: {
        rules: [ {
            test: /\.js$/,
            exclude: /(sinon|chai|diff)/,
            loader: 'babel-loader'
        } ]
    },
    resolve: {
        modules: [
            __dirname,
            'node_modules'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};

export let testConfig = Object.assign({}, defaultWebpackConfig, {
    devtool: 'inline-source-map',
    node: { // WORKAROUND: https://github.com/webpack-contrib/css-loader/issues/447
        fs: 'empty',
        child_process: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(sinon|chai|diff)/,
                loader: 'babel-loader'
            },

            {
                test: /\.js$/,
                // enforce: 'post',
                include: path.resolve('src/'),
                exclude: /node_modules|test/,
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true
                    }
                }
            }
        ]
    }
});

export let webConfig = Object.assign({}, defaultWebpackConfig, {
    target: 'web',
    devtool: 'source-map',
    output: {
        filename: FILE_NAME + '.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: MODULE_NAME,
        pathinfo: false
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});


export let minifiedConfig = Object.assign({}, webConfig, {
    output: {
        filename: FILE_NAME + '.min.js',
        pathinfo: false,
        library: MODULE_NAME
    },
    plugins: webConfig.plugins.concat([
        new UglifyJSPlugin({
            test: /\.js$/,
            beautify: false,
            minimize: true,
            compress: {
                warnings: false,
                sequences: false
            },
            mangle: false,
            sourceMap: true
        })
    ])
});

export default [webConfig, minifiedConfig];
