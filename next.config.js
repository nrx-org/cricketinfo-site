const webpack = require("webpack");
const withSass = require("@zeit/next-sass");

const config = {
  webpack: webpackConfig => {
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        "process.env.COMMIT_SHA1": `"${process.env.COMMIT_SHA1}"`
      })
    );

    return webpackConfig;
  }
};

if (process.env.IS_NOW) {
  config.target = "serverless";
}

module.exports = withSass(config);
