const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url-loader' },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new VueLoaderPlugin()],
}

module.exports = (env, { mode }) => {
  if (mode === 'development') {
    config.entry = path.resolve(__dirname, './examples/main.js')
    config.output = {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
    }
    config.devServer = {
      port: 9527,
      open: false,
      client: {
        logging: 'error',
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    }
    config.plugins = [
      ...config.plugins,
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.html'),
        filename: 'index.html',
        title: 'Vue3PreviewImage',
      }),
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`You application is running here http://localhost:${config.devServer.port}`]
        },
      }),
    ]
    config.stats = 'errors-only'
  }
  if (mode === 'production') {
    config.entry = path.resolve(__dirname, './src/index.js')
    config.output = {
      path: path.resolve(__dirname, './lib'),
      filename: 'vue3-preview-image.min.js',
      library: 'Vue3PreviewImage',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    }
    config.externals = {
      vue: 'vue',
    }
  }
  return config
}
