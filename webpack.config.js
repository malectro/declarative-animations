
const config = {
  entry: './src/animation.js',
  output: {
    path: 'build',
    filename: 'animation.js',
    library: 'Animation',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};

module.exports = config;

