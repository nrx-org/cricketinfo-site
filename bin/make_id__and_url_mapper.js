/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");

// path to content from spreadsheet
const pathToParsedFile = "./csv/bottom_sheets.csv";
const currentLanguage = "en";
// const currentLanguage = "hi"
// const currentLanguage = "ta"

const sheetInput = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});
const records = parse(sheetInput, { columns: true, delimiter: "," });

const contentUrls = JSON.parse(
  fs.readFileSync("./bin/content_urls.json", "utf8")
);

let article;
let enTitle;
let idMap;
let idMapStream;

if (currentLanguage === "en") {
  // for English, create file to map IDs
  // idMapStream = fs.createWriteStream("./bin/article_ids.json");
  // idMapStream.write('{"IDs": [');
  const idMapInput = fs.readFileSync(
    "./bin/article_ids.json",
    "utf8",
    (err, content) => {
      return content;
    }
  );
  idMap = JSON.parse(idMapInput);
} else {
  // for Hindi/Tamil, append to the existing file
  const idMapInput = fs.readFileSync(
    "./bin/article_ids.json",
    "utf8",
    (err, content) => {
      return content;
    }
  );
  idMap = JSON.parse(idMapInput);
}

records.forEach(record => {
  article = {
    // id: record["Article Link ID"],
    id: record["su"],
    // title: record["Name of personality"]
    title: record["Title"]
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
    idMap.map.forEach(idMapRecord => {
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
  ] = `/static/content/${currentLanguage}/${getSluggedTitle()}.json`;
});

fs.writeFileSync(
  "./bin/content_urls.json",
  JSON.stringify(contentUrls, null, 2)
);

if (currentLanguage === "en") {
  // For English, finish the ID map file
  fs.writeFileSync("./bin/article_ids.json", "");
  fs.writeFileSync("./bin/article_ids.json", JSON.stringify(idMap, null, 2));
} else {
  // For Hindi/Tamil, rewrite the entire file

  fs.writeFileSync("./bin/article_ids.json", "");
  fs.writeFileSync("./bin/article_ids.json", idMap);
}
