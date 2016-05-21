'use strict';

const path = require('path');
const include = path.resolve(__dirname, "src");
console.log(include);

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: 'inline-source-map',
  entry: {
    main: [ './index.js' ]
  },
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include,
        loader: 'babel',
        query: {
          presets: ["react", "es2015"],
          cacheDirectory: true
        }
      }
    ]
  },
  resolve: {
    // alias: {
    //   'react-dnd-card': path.resolve(__dirname, '../lib')
    // },
    modulesDirectories: [ 'node_modules' ]
  }
};
