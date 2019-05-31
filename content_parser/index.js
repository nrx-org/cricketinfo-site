/* eslint-disable no-console */

const { exportIdAndUrlMaps } = require("./export_id_url_maps");
const { exportPersonalities } = require("./export_personalities");
const { exportTeams } = require("./export_teams");
const { exportHome } = require("./export_home");
const { exportPlaces } = require("./export_places");
const { exportEventsIndividual } = require("./export_events_individual");
const { exportEventsMajor } = require("./export_events_major");

exportIdAndUrlMaps();

const importMap = {
  personalities: exportPersonalities,
  places: exportPlaces,
  home: exportHome,
  teams: exportTeams,
  "events-major": exportEventsMajor,
  "events-individual": exportEventsIndividual
};

let importsToRun = [];

if (process.argv.length === 2) {
  importsToRun = Object.keys(importMap);
} else if (process.argv.length > 2) {
  importsToRun = process.argv.slice(2);
}

importsToRun.forEach(i => {
  if (!Object.hasOwnProperty.call(importMap, i)) {
    console.log(`ERROR: could not recognize import "${i}"`);
    process.exit(1);
  }
});

console.log("Importing the following sheets:", importsToRun.join(", "));
importsToRun.forEach(i => importMap[i]());
