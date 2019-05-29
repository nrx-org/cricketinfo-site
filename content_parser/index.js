const { exportIdAndUrlMaps } = require("./export_id_url_maps");
const { exportPersonalities } = require("./export_personalities");
<<<<<<< HEAD
const { exportHome } = require("./export_home");
const { exportPlaces } = require("./export_places");
const { exportEventsIndividual } = require("./export_events_individual");

exportIdAndUrlMaps();
exportPersonalities();
exportHome();
exportPlaces();
exportEventsIndividual();
=======
const { exportTeams } = require("./export_teams");
const { exportHome } = require("./export_home");
const { exportPlaces } = require("./export_places");

exportIdAndUrlMaps();
exportPersonalities();
exportTeams();
exportHome();
exportPlaces();
>>>>>>> feature/content-parser
