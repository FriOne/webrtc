const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.ProvidePlugin({ React: 'react' })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.module.css$/i,
        use: [
          stylesHandler,
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[name]_[local]_[hash:base64:5]' },
            },
          },
          'postcss-loader'
        ],
      },
      {
        test: /\.css$/i,
        use: [
          stylesHandler,
          'css-loader',
          'postcss-loader'
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
