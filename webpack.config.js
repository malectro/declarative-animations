function spread(...args) {
  return Object.assign({}, ...args);
}

const output = {
  path: 'build',
  library: 'Animation',
};

const baseConfig = {
  entry: './src/animation.js',
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

const umdConfig = spread(baseConfig, {
  output: spread(output, {
    filename: 'animation.umd.js',
    libraryTarget: 'umd',
  }),
});

const commonJsConfig = spread(baseConfig, {
  externals: ['bezier-easing'],
  output: spread(output, {
    filename: 'animation.commonjs2.js',
    libraryTarget: 'commonjs2',
  }),
});

module.exports = [umdConfig, commonJsConfig];

