'use strict';

var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var webpack = require('webpack');
var env = process.env.NODE_ENV;
var isDevelopment = env === 'development';
var isProduction = env === 'production';

var config = {
  externals: {
    'reselect': {
      root: 'Reselect',
      commonjs2: 'reselect',
      commonjs: 'reselect',
      amd: 'reselect'
    },
    'normalizr': {
      root: 'Normalizr',
      commonjs2: 'normalizr',
      commonjs: 'normalizr',
      amd: 'normalizr'
    },
  },
  mode: env,
  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Redoop',
    libraryTarget: 'umd',
    filename: isDevelopment ? 'redoop.js' : 'redoop.min.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (isProduction) {
  config.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }
    })
  )
};

module.exports = config;