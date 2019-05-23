/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const fetch = require("isomorphic-fetch");
const slugify = require("slugify");

const pathToParsedFile = "./csv/bottom_sheets.csv";
const currentLanguage = "en";
// const currentLanguage = "hi";
// const currentLanguage = "ta";

// read content
const input = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});

const records = parse(input, {
  columns: true,
  delimiter: ","
});

let bottomSheet;

records.forEach(async element => {
  bottomSheet = {
    id: element["su"],
    title: element["Title"]
  };

  const getSluggedTitle = str => {
    if (!str) return bottomSheet.title.replace(/ /g, "_").toLowerCase();
    return str.replace(/ /g, "_").toLowerCase();
  };

  const getFileNameFromURL = url => {
    if (!url) return null;
    return url.match(/File:(.*)/)[1];
  };

  const getImageForArticle = async url => {
    // const image = await fetch(url);
    const imageName = getFileNameFromURL(url);
    const imageDirectory = `./static/images/${getSluggedTitle()}`;
    const imagePath = `${imageDirectory}/${imageName}`;
    // if (!fs.existsSync(imageDirectory)) {
    // fs.mkdir(imageDirectory, err => {
    // if (err) throw err;
    // });
    // }
    // const imageFile = fs.createWriteStream(imagePath);
    // image.body.pipe(imageFile);
    return imagePath.substring(1);
  };

  bottomSheet = {
    ...bottomSheet,
    coverImg: {
      url: `${await getImageForArticle(element["Image Link"])}`,
      altText: element["Image caption"]
    },
    summary: element["Short description"]
  };

  fs.writeFile(
    `./static/content/${currentLanguage}/${getSluggedTitle()}.json`,
    JSON.stringify(bottomSheet, null, 2),
    err => {
      if (err) console.log(err);
    }
  );
});
