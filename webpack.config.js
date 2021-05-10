module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    library: {
      type: 'umd'
    },
    globalObject: 'this',
  },
  resolve: {
    fallback: {
      "assert": require.resolve("assert/"),
      "path": require.resolve("path-browserify"),
      "buffer": require.resolve("buffer/"),
      "fs": false
    }
  }
}