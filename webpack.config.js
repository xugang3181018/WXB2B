const path = require('path')
const webpack = require('webpack')
const argv = require('yargs-parser')(process.argv.slice(1))
const production = argv.mode == 'production' ? true : false
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const glob = require('glob')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

const plugins = [
  new webpack.ProgressPlugin({ activeModules: true }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    favicon: './src/assets/images/favicon.jpg',
    template: path.resolve(__dirname, 'src/index.html'),
    hash: production
  }),
  new MiniCssExtractPlugin({
    filename: production ? 'css/[name].[hash].css' : 'css/[name].css',
    chunkFilename: production ? 'css/[id].[hash].css' : 'css/[id].css'
  }),
  new SimpleProgressWebpackPlugin()
]

if (production) {
  plugins.push(
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 1024,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          // warnings: false,
          drop_debugger: true,
          drop_console: true
        }
      },
      sourceMap: false,
      parallel: true
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin()
  )
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin())
}

module.exports = {
  stats: {
    children: false,
    warningsFilter: warning => /Conflicting order between/gm.test(warning)
  },
  performance: {
    hints: false,
    maxEntrypointSize: 5000000,
    maxAssetSize: 3000000
  },
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: production ? 'js/[name]_[chunkhash].js' : 'js/[name].js',
    chunkFilename: production ? 'js/[name]_[chunkhash].js' : 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.(le|sc|c)ss$/,
        use: [
          production ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          // 'less-loader',
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '2px'
                },
                javascriptEnabled: true
              }
            }
          }
          // {
          //   loader: 'style-resources-loader',
          //   options: {
          //       patterns: ['./src/assets/style/variables/*.less']
          //   }
          // }
        ]
      },
      {
        test: /\.(png|jpg|gif|jpe?g)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name]_[hash].[ext]',
              publicPath: '../'
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  devServer: {
    port: 9090,
    open: true,
    hot: true,
    compress: true,
    inline: true,
    //host: '192.168.41.124',
    overlay: true,
    historyApiFallback: true,
    proxy: {
      '/open': {
        target: 'https://testclubshop.liantuobank.com',
        // target: 'https://clubshop.liantuobank.com',
        changeOrigin: true,
        pathRewrite: {
          '^/open': '/open'
        }
      },
      '/api/ym': {
        target: 'https://ymht.liantuofu.com',
        // target: 'https://ymht.liantuobank.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/ym': '/api/ym'
        }
      }
      // '/ws': {
      //   target: 'https://apis.map.qq.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ws': '/ws'
      //   }
      // }
    }
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
      pages: path.join(__dirname, './src/pages'),
      component: path.join(__dirname, './src/component'),
      less: path.join(__dirname, './src/assets/less'),
      style: path.join(__dirname, './src/assets/style'),
      images: path.join(__dirname, './src/assets/images'),
      icon: path.join(__dirname, './src/assets/icon'),
      api: path.join(__dirname, './src/api'),
      context: path.join(__dirname, './src/context'),
      routes: path.join(__dirname, './src/routes'),
      layout: path.join(__dirname, './src/layout'),
      hooks: path.join(__dirname, './src/hooks'),
      'react-dom': '@hot-loader/react-dom'
    },
    mainFiles: ['index'],
    extensions: ['.js', '.jsx', '.json', '.css', '.less']
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          priority: 3,
          minChunks: 3
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'async',
          enforce: true
        }
      }
    }
  },
  devtool: production ? 'none' : 'inline-source-map'
}
