const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const {
  findIdMapEntryById,
  getSluggedTitle,
  downloadImageAndFillAttributions
} = require("./lib");
const idMap = require("../static/content/article_ids.json");

const csvExports = {
  en: { path: "./csv/places.en.csv" },
  hi: { path: "./csv/places.hi.csv" },
  ta: { path: "./csv/places.ta.csv" }
};

const ID_KEY = "Article Link ID";
const TITLE_KEY = "Name of the place";
const SUMMARY_KEY = "Short summary description of the place";
const WIKIPEDIA_URL_KEY = "Wikipedia Link to Place";
const COVER_IMAGE_KEY = "Header image";

module.exports.exportPlaces = () => {
  Object.keys(csvExports).forEach(lang => {
    const fileContent = fs.readFileSync(csvExports[lang].path, "utf8");
    const records = parse(fileContent, { columns: true, delimiter: "," });

    records.forEach(async record => {
      const idTitleMap = findIdMapEntryById(idMap, record[ID_KEY]);
      const englishSlug = getSluggedTitle(idTitleMap.title.en);
      const place = {};

      place.title = record[TITLE_KEY];
      if (!place.title) {
        return;
      }

      place.summary = record[SUMMARY_KEY];
      place.wikipediaUrl = record[WIKIPEDIA_URL_KEY];
      place.coverImage = await downloadImageAndFillAttributions(
        {
          url: record[COVER_IMAGE_KEY],
          altText: `Image of ${place.title}`
        },
        englishSlug
      );

      const translationLanguages = Object.keys(csvExports).filter(
        l => l !== lang
      );

      place.translations = translationLanguages.map(tl => ({
        lang: tl,
        title: idTitleMap.title[tl],
        url: `/read/${tl}/${englishSlug}`
      }));

      place.sections = [];

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(place, null, 2)
      );
    });
  });
};
