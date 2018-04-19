const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', './src/index.jsx'],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(|js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "./fonts/[name].[ext]",
                    publicPath: '/',
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "./images/[name].[ext]",
                    publicPath: '/'
                }
            }
        ]
    },
    output: {
        filename: './scripts/bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            TAROT_CONFIG: JSON.stringify(require("./tarot-config.json"))
        })
    ]
};