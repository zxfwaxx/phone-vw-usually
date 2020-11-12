const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

/**
 * 拼接相对于当前目录的下 文件的相对路径
 * @param dir 目录
 * @return {string}
 */
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.31.73:8080',
    //     pathRewrite: { '^/api': '' },
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('IMG', resolve('src/assets/images'))
      .set('MIXINS', resolve('src/mixins'))
      .set('VIEWS', resolve('src/views'))
      .set('COMPONENTS', resolve('src/components'))
      .set('UTIL', resolve('src/util'))
      .set('API', resolve('src/api'))
      .set('STYLE', resolve('src/style'))

    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'phoneUsually'
        return args
      })

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                // elementUI: {
                //   name: 'chunk-elementUI', // split elementUI into a single package
                //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                // },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  configureWebpack: {
    plugins: [],
    externals: {},
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        })
      ]
    }
  }
}
