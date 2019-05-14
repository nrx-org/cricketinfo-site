/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const pathToParsedFile = "./csv/bottom_sheets.csv";

// read content
const input = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});

const records = parse(input, {
  columns: true,
  delimiter: ","
});

let bottomSheets;

const stream = fs.createWriteStream("./csv/bottom_sheets.json", { flags: "a" });
stream.write("{sheets: [");

records.forEach(element => {
  bottomSheets = {
    id: element["su"],
    title: element["Title"],
    desc: element["Short description"],
    img: {
      url: element["Image Link"],
      altText: element["Image caption"]
    }
  };

  stream.write(JSON.stringify(bottomSheets, null, 2));
  stream.write(", ");
});

stream.write("]} ");
