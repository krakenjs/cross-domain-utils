import { testConfig } from './webpack.config';
import { argv } from 'yargs';
import * as path from 'path';
import * as webpack from 'webpack';

export default (config) => {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        // basePath: __dirname,

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'mocha', 'chai'
        ],

        // list of files / patterns to load in the browser
        files: [
            
            'test/index.js'
        ],
        preprocessors: {
            'test/index.js': [ 'webpack', 'sourcemap' ]
        },

        webpack: testConfig,

        
        // list of files to exclude
        exclude: [
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'spec', 'coverage-istanbul' ],
        coverageIstanbulReporter: {
            reports: [ 'text', 'html' ],
            fixWebpackSourcePaths: true
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: process.env.NODE_ENV === 'debug' ? config.LOG_DEBUG : config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: process.env.NODE_ENV === 'debug' ? false : true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
