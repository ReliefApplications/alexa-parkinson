const path = require('path');
// const nodeExternals = require('webpack-node-externals');

const {
  NODE_ENV = 'production',
} = process.env;

module.exports = {
  entry: './app.js',
  mode: NODE_ENV,
  // externals: [ nodeExternals() ],
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  // module: {
  //   noParse: /configurations.js/
  // },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  }
};