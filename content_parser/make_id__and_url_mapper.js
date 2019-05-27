const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const csvExports = {
  en: [
    "./csv/personalities.en.csv",
    "./csv/places.en.csv",
    "./csv/teams.en.csv",
    "./csv/events_individual.en.csv",
    "./csv/events_major.en.csv",
    "./csv/bottom_sheets.en.csv"
  ],
  hi: [
    "./csv/personalities.hi.csv",
    "./csv/places.hi.csv",
    "./csv/teams.hi.csv",
    "./csv/events_individual.hi.csv",
    "./csv/events_major.hi.csv",
    "./csv/bottom_sheets.en.csv"
  ],
  ta: [
    "./csv/personalities.ta.csv",
    "./csv/places.ta.csv",
    "./csv/teams.ta.csv",
    "./csv/events_individual.ta.csv",
    "./csv/events_major.ta.csv",
    "./csv/bottom_sheets.en.csv"
  ]
};

// path to content from spreadsheet
const pathToParsedFile = "./csv/personalities.csv";
// const pathToParsedFile = "./csv/places.csv";
const currentLanguage = "en";
// const currentLanguage = "hi";
// const currentLanguage = "ta";

// Read from the sheet to be parsed
const sheetInput = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});
const records = parse(sheetInput, { columns: true, delimiter: "," });

const contentUrls = JSON.parse(
  fs.readFileSync("./content_parser/content_urls.json", "utf8")
);

// Read from the object mapping IDs to article titles
let idMap;
let idMapStream;

if (currentLanguage === "en") {
  // for English, create file to map IDs
  // idMapStream = fs.createWriteStream("./content_parser/article_ids.json");
  // idMapStream.write('{"IDs": [');
  const idMapInput = fs.readFileSync(
    "./content_parser/article_ids.json",
    "utf8"
  );
  idMap = JSON.parse(idMapInput);
} else {
  // for Hindi/Tamil, append to the existing file
  const idMapInput = fs.readFileSync(
    "./content_parser/article_ids.json",
    "utf8"
  );
  idMap = JSON.parse(idMapInput);
}

let article;
let enTitle;

records.forEach(record => {
  article = {
    id: record["Article Link ID"],
    // id: record["su"],
    // title: record["Name of personality"]
    // title: record["Title"]
    title: record["Name of the place"]
  };

  if (currentLanguage === "en") {
    const idMapR = {
      id: article["id"],
      title: {
        en: article["title"],
        hi: "",
        ta: ""
      }
    };
    enTitle = article["title"];
    idMap = [...idMap, idMapR];
    // idMapStream.write(JSON.stringify(idMap, null, 2));
    // idMapStream.write(",");
  } else {
    idMap.forEach(idMapRecord => {
      if (idMapRecord["id"] === article["id"]) {
        // eslint-disable-next-line no-param-reassign
        idMapRecord["title"][currentLanguage] = article["title"];
        enTitle = idMapRecord["title"]["en"];
      }
    });
  }

  // Get title for URL
  // Since toLowerCase respects locale, and there are no differences in upper and lower case
  // for both Hindi and Tamil, I'm hoping nothing too important breaks by using this.
  const getSluggedTitle = str => {
    if (!str) return article.title.replace(/ /g, "_").toLowerCase();
    return str.replace(/ /g, "_").toLowerCase();
  };
  const enSluggedTitle = getSluggedTitle(enTitle);

  // Add the key with the path to the JSON file for the router
  contentUrls[currentLanguage][
    enSluggedTitle
  ] = `/static/content/${currentLanguage}/${enSluggedTitle}.json`;
});

fs.writeFileSync(
  "./content_parser/content_urls.json",
  JSON.stringify(contentUrls, null, 2)
);

fs.writeFileSync("./content_parser/article_ids.json", "");
fs.writeFileSync(
  "./content_parser/article_ids.json",
  JSON.stringify(idMap, null, 2)
);
