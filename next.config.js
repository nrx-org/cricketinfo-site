const withSass = require("@zeit/next-sass");

const config = {};

if (process.env.IS_NOW) {
  config.target = "serverless";
}

module.exports = withSass(config);
