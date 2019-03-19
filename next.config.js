const config = {};

if (process.env.NOW_REGION || process.env.NOW) {
  config.target = "serverless";
}

module.exports = config;
