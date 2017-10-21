'use strict';

const path = require('path');
const packageJson = require('./package.json');

module.exports = {
    entry: {
        app: './src/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: `${packageJson.name}.min.js`,
        path: path.resolve(__dirname, 'dist'),
        library: packageJson.name,
        libraryTarget: 'umd'
    },
    devtool: 'source-map'
};