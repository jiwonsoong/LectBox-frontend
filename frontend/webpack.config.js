var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader?name=assets/images/[name].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                          mozjpeg: {
                            progressive: true,
                            quality: 65
                          },
                          // optipng.enabled: false will disable optipng
                          optipng: {
                            enabled: false,
                            },
                            pngquant: {
                              quality: [0.65, 0.90],
                              speed: 4
                            },
                            gifsicle: {
                              interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                              quality: 75
                            }
                        }
                    }
                    // image-webpack-loader는 이미지 사이즈를 줄여주는 역할
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    devServer: {
        historyApiFallback: true
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://localhost:80'
        })
    }
}