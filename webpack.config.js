const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                enforce: "pre",
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", 'react']
                }
            },
            {
                test: /\.scss$/,
                loader: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.css$/,
                loader: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "fonts/[name].[ext]",
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'dist'),
        // publicPath: 'assets',
        proxy: {
            '*': {
                target: 'http://localhost:8888',
                secure: false,
                changeOrigin: true,
            }
        },
    },
};