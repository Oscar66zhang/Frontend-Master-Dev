const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  entry: path.resolve(__dirname, '../src/view/main/main.ts'),
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  module: {
    rules: [
      // 图片资源
      {
        test: /\.(png|jpeg|svg|bmp|gif|jpg)$/,
        type: 'asset',
        generator: {
          filename: 'img/[hash][ext]', 
        },
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024,
          },
        },
      },
      // CSS/SCSS
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      //Vue
        {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // TypeScript
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        exclude: /node_modules/,
      },
      // Babel (ES6+ 转 ES5)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue'],  // 自动解析这些扩展名
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack app main',
      template: path.resolve(__dirname, '../src/view/main/main.html'),
    }),
    new VueLoaderPlugin()
  ],
};
