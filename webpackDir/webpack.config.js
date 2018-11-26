// webpack配置文件遵循common.js规范
let path = require('path')
let webpack = require('webpack')
let globAll = require('glob-all')
let purifyCss = require('purifycss-webpack')
let extractTextWebpackPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let inlineChunk = require('html-webpack-inline-chunk-plugin')
module.exports = {
    entry: {
        main: './src/js/main.js',
        // vender: ['lodash-es','jquery'], // 加一个vender是因为提取公共代码时针对多entry的
        // commonES6: './src/js/common.js', // 加一个vender是因为提取公共代码时针对多entry的
        // asyncModule: './src/js/asyncModule',
        // asyncModule2: './src/js/asyncModule2'
    },
    devtool: 'source-map',
    devServer: {
        port: 9001,
        hot: true,
        hotOnly: true,
        inline: true, // 会在页面开头显示打包状态 默认就是true
        overlay: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // 没有这个语法规范，仍然无法转义
                        plugins: ['babel-plugin-lodash']
                    }
                },
                exclude: '/node_modules/'
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         {
            //             loader: 'style-loader',
            //             // loader: 'style-loader/url',
            //         },
            //         {
            //             loader: 'css-loader',
            //             // loader: 'file-loader', //和/url配合使用，表示采用link方式
            //         }
            //     ],
            // },

            // scss
            {
                test: /\.scss$/,
                //模块热更新是通过style-loader 处理的，用了extract就不能热更新了，因此在开发环境不要提取css
                use: extractTextWebpackPlugin.extract({
                    fallback: {
                        loader: 'style-loader',
                    },
                    use: [
                        {
                            loader: 'css-loader',
                            // loader: 'file-loader', // 和style-loader/url配合使用，表示采用link方式
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    // require('autoprefixer')(), //自动添加兼容性前缀
                                    require('postcss-cssnext')(), // 使用css未来功能 已经包含了autoprefixer
                                    require('postcss-sprites')({
                                        spritePath: '/img/sprites',
                                        // 解决多倍高清图片 视网膜屏幕
                                        // retina: true
                                    }),
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            // loader: 'file-loader', //和/url配合使用，表示采用link方式
                        }
                    ]
                }),
                // use: [
                //     {
                //         loader: 'style-loader'
                //     },
                //     {
                //         loader: 'css-loader',
                //         // loader: 'file-loader', // 和style-loader/url配合使用，表示采用link方式
                //         options: {
                //             minimize: true
                //         }
                //     },
                //     {
                //         loader: 'postcss-loader',
                //         options: {
                //             ident: 'postcss',
                //             plugins: [
                //                 // require('autoprefixer')(), //自动添加兼容性前缀
                //                 require('postcss-cssnext')(), // 使用css未来功能 已经包含了autoprefixer
                //                 require('postcss-sprites')({
                //                     spritePath: '/img/sprites',
                //                     // 解决多倍高清图片 视网膜屏幕
                //                     // retina: true
                //                 }),
                //             ]
                //         }
                //     },
                //     {
                //         loader: 'sass-loader'
                //     }
                // ]
            },
            // 图片
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                use: [
                    {
                        // loader: 'file-loader',
                        loader: 'url-loader', // url-loader具备file-loader的功能，并且能转base64
                        options: {
                            // ext是后缀
                            name: '[name].min.[ext]',
                            // 小于150k使用base64位
                            limit: 30000,
                            // 引用路径
                            publicPath: './img/',
                            // useRelativePath: true,
                            // 输出路径
                            outputPath: '/img/'   // 因为output中已经定义了dist目录 ，因此这儿根目录就是dist
                        }
                    },
                    {
                        loader: 'img-loader', // 压缩图片
                        options: {
                            pngquant: {
                                quality: 90
                            }
                        }
                    }
                ]
            },
            // 字体
            {
                test: /\.(eot|woff2|woff|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // ext是后缀
                            name: '[name].min.[ext]',
                            limit: 1000,
                            // 绝对路径
                            publicPath: './font/',
                            // useRelativePath: true,
                            outputPath: '/font/'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src']
                    }
                }]
            }
        ]
    },
    output: {
        // filename: '[name].min.[hash:5].js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'), // 发布环境
        // path: '/', // 开发环境
        chunkFilename: '[name].chunk.js', // 不定义这个，就会命名为0.bundle.js(包含异步); 前提有可提取代码，否则就不会有chunk文件生成
        publicPath: './' // index.html的目录
        // publicPath: '/' // 开发环境
    },
    plugins: [
        // 热更新相关
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            // 默认会把所有entry中的js载入到html,现在可以指定
            // chunks: ['app'],
            minify: {
                // 压缩空格
                collapseWhitespace: true
            },
            inject: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            cache: true
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commonES6',
        //     minChunks: 2,
        //     chunks: ['commonES6', 'main']
        // }),
        // 提取公共代码时针对多entry, 单entry只能用代码分割
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vender', // 如果这个new webpack除了名称，其它配置都相同，这里可以用数组合并 names:['vender','manifest']
        //     minChunks: 2
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest', // 除了vender以外的,都是webpack无用代码
            minChunks: 2
        }),
        new inlineChunk({
            inlineChunks: ['manifest']
        }),
        new extractTextWebpackPlugin({
            filename: '[name].min.css'
        }),
        new purifyCss({
            paths: globAll.sync([
                path.join(__dirname, './*.html'),
                path.join(__dirname, './src/js/*.js')
            ])
        }),
        // 引用打包的第三方
        new webpack.DllReferencePlugin({
            manifest: require('./src/dll/lodash-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            manifest: require('./src/dll/jquery-manifest.json')
        }),
        new CleanWebpackPlugin(['dist']),
    ]
}