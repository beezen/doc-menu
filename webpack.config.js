const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const rootPath = path.resolve(process.cwd());
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        pageMenu: path.join(__dirname, "./src/pageMenu.js"),
    },
    output: {
        pathinfo: true,
        path: path.resolve(rootPath, 'lib'),
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.js?$/,
            use: ['babel-loader'],
            exclude: /node_modules/,
        }, {
            test: /.(le|c)ss$/,
            use: [
                { loader: MiniCssExtractPlugin.loader },
                "css-loader",
                "less-loader"
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        dead_code: true
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    devtool: 'none',
    cache: true,
    resolve: {
        extensions: [".js"],
    },
}