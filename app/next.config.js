module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    // if (!isServer) {
    //   config.resolve.fallback = {
    //     fs: 'empty'
    //   }
    // }

    return config
  },

  dir: './src',

  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    }
    return config
  },
};
