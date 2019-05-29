const { exportIdAndUrlMaps } = require("./export_id_url_maps");
const { exportPersonalities } = require("./export_personalities");
const { exportTeams } = require("./export_teams");
const { exportHome } = require("./export_home");
const { exportPlaces } = require("./export_places");

exportIdAndUrlMaps();
exportPersonalities();
exportTeams();
exportHome();
exportPlaces();
