const { exportIdAndUrlMaps } = require("./export_id_url_maps");
const { exportPersonalities } = require("./export_personalities");
const { exportHome } = require("./export_home");

exportIdAndUrlMaps();
exportPersonalities();
exportHome();
