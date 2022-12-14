const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, '../src/script.ts'),
    output:
        {
            hashFunction: 'xxhash64',
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, '../dist')
        },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../static') }
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                minify: true
            }),
            new MiniCSSExtractPlugin()
        ],
    module:
        {
            rules:
                [
                    // HTML
                    {
                        test: /\.(html)$/,
                        use:
                            [
                                'html-loader'
                            ]
                    },

                    // JS TS
                    {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                    },

                    // CSS
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            // Creates `style` nodes from JS strings
                            "style-loader",
                            // Translates CSS into CommonJS
                            "css-loader",
                            // Compiles Sass to CSS
                            "sass-loader",
                        ],
                    },

                    // Images
                    {
                        test: /\.(jpg|png|gif|svg)$/,
                        type: 'asset/resource',
                        generator:
                            {
                                filename: 'assets/images/[hash][ext]'
                            }
                    },

                    // Fonts
                    {
                        test: /\.(ttf|eot|woff|woff2)$/,
                        type: 'asset/resource',
                        generator:
                            {
                                filename: 'assets/fonts/[hash][ext]'
                            }
                    }
                ]
        }
}
