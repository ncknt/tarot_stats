const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'main',
                    test: /\.(css|scss)$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./styles/[name].css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: [
                    { loader: MiniCssExtractPlugin.loader }
                    , { loader: "css-loader" } // translates CSS into CommonJS
                    , { loader: "sass-loader" } // compiles Sass to CSS
                ]
            },
            {
                test: /\.css$/,
                loader: [
                    { loader: MiniCssExtractPlugin.loader }
                    , { loader: "css-loader" } // translates CSS into CommonJS
                ]
            },
        ]
    },
    output: {
        filename: './scripts/bundle.js',
        path: path.resolve(__dirname, 'public')
    }
});