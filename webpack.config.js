var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'conditional-expression.js',
    library: 'match',
    libraryTarget: 'umd'
  }
};