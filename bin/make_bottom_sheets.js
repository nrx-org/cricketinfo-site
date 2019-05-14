/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require("slugify");

const pathToParsedFile = "./csv/bottom_sheets.csv";

// read content
const input = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});

const records = parse(input, {
  columns: true,
  delimiter: ","
});

let bottomSheet;

records.forEach(element => {
  bottomSheet = {
    id: element["su"],
    title: element["Title"],
    coverImg: {
      url: element["Image Link"],
      altText: element["Image caption"]
    },
    summary: element["Short description"]
  };

  const getSluggedTitle = slugify(bottomSheet.title, "_").toLowerCase(); // TODO: remove slugify

  fs.writeFile(
    `./csv/${getSluggedTitle}.json`,
    JSON.stringify(bottomSheet, null, 2),
    err => {
      if (err) console.log(err);
    }
  );
});
