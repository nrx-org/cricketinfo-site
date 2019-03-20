const config = {};

if (process.env.IS_NOW) {
  config.target = "serverless";
}

module.exports = config;
