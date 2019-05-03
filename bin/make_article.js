/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const slugify = require("slugify");

// path to content from spreadsheet
const path = "./csv/personalities.csv";

// read content
const input = fs.readFileSync(path, "utf8", (err, content) => {
  return content;
});

//  create JS Object
const records = parse(input, {
  columns: true,
  delimiter: ","
});

let article;

records.forEach(record => {


  const sluggedTitle = slugify(article.title, "_").toLowerCase(); //TODO: remove slugify

  fs.writeFile(`./csv/${sluggedTitle}.json`, JSON.stringify(article), err => {
    if (err) console.log(err);
  });
});

//TODO: refactor components to not dispolay things if value is empty string.

//TODO: optimize the images by downloading them all initially and then running them
//through ImageOptim and then moving them to static.

//TODO: write a function which takes every url, and enters it only if the
//link of the url exisst in our experience
