const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const {
  findIdMapEntryById,
  getSluggedTitle,
  downloadImageAndFillAttributions,
  getCardInfoFromId
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
const IMPORTANT_DAY_1_KEY = "Important day 1";
const IMPORTANT_DAY_1_DATE_KEY = "Important day 1 date";
const IMPORTANT_DAY_2_KEY = "Important day 2";
const IMPORTANT_DAY_2_DATE_KEY = "Important day 2 date";
const IMPORTANT_DAY_3_KEY = "Important day 3";
const IMPORTANT_DAY_3_DATE_KEY = "Important day 3 date";
const TOTAL_AREA_KEY = "Total Area of country (km squared)";
const POPULATION_KEY = "Population";
const OTHER_NAMES_KEY = "Other names";
const CAPITAL_CITY_KEY = "Capital city";
const LARGEST_CITY_KEY = "Largest city";
const TIMEZONE_KEY = "Timezone";

const HISTORY = [
  {
    TITLE_KEY: "History Phase 1 Title",
    TIME_PERIOD_KEY: "History Phase 1 Time period",
    DESCRIPTION_KEY: "History Phase 1 Small description"
  },
  {
    TITLE_KEY: "History Phase 2 Title",
    TIME_PERIOD_KEY: "History Phase 2 Time period",
    DESCRIPTION_KEY: "History Phase 2  Small description"
  },
  {
    TITLE_KEY: "History Phase 3 Title",
    TIME_PERIOD_KEY: "History Phase 3 Time period",
    DESCRIPTION_KEY: "History Phase 3  Small description"
  },
  {
    TITLE_KEY: "History Phase 4 Title",
    TIME_PERIOD_KEY: "History Phase 4 Time period",
    DESCRIPTION_KEY: "History Phase 4  Small description"
  }
];

const GOVERNMENT_KEY = "Government";

const GOVERNMENT_PEOPLE = [
  {
    NAME_KEY: "Prime minister name",
    IMAGE_KEY: "Prime minister image link"
  },
  {
    NAME_KEY: "President",
    IMAGE_KEY: "President image link"
  },
  {
    NAME_KEY: "Chief Justice name",
    IMAGE_KEY: "Chief Justice image link"
  }
];

const IN_SPORTS = [
  { KEY: "Team ID Code", isPlayer: false },
  { key: "Player 1 ID Code", isPlayer: true },
  { key: "Player 2 ID Code", isPlayer: true }
];

const GEOGRAPHY_KEY = "Geography";
const GEOGRAPHY_IMAGE_KEY = "Link to relevant image  - geography";

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

      // About table.
      const aboutTableFacts = [
        record[IMPORTANT_DAY_1_KEY] && {
          label: record[IMPORTANT_DAY_1_KEY],
          value: {
            label: record[IMPORTANT_DAY_1_DATE_KEY]
          }
        },
        record[IMPORTANT_DAY_2_KEY] && {
          label: record[IMPORTANT_DAY_2_KEY],
          value: {
            label: record[IMPORTANT_DAY_2_DATE_KEY]
          }
        },
        record[IMPORTANT_DAY_3_KEY] && {
          label: record[IMPORTANT_DAY_3_KEY],
          value: {
            label: record[IMPORTANT_DAY_3_DATE_KEY]
          }
        },
        record[TOTAL_AREA_KEY] && {
          label: TOTAL_AREA_KEY,
          value: {
            label: record[TOTAL_AREA_KEY]
          }
        },
        record[POPULATION_KEY] && {
          label: POPULATION_KEY,
          value: {
            label: record[POPULATION_KEY]
          }
        },
        record[OTHER_NAMES_KEY] && {
          label: OTHER_NAMES_KEY,
          value: {
            label: record[OTHER_NAMES_KEY]
          }
        },
        record[CAPITAL_CITY_KEY] && {
          label: CAPITAL_CITY_KEY,
          value: {
            label: record[CAPITAL_CITY_KEY]
          }
        },
        record[LARGEST_CITY_KEY] && {
          label: LARGEST_CITY_KEY,
          value: {
            label: record[LARGEST_CITY_KEY]
          }
        },
        record[TIMEZONE_KEY] && {
          label: TIMEZONE_KEY,
          value: {
            label: record[TIMEZONE_KEY]
          }
        }
      ].filter(f => !!f);

      if (aboutTableFacts.length > 0) {
        place.sections.push({
          title: "About",
          cardType: "table",
          facts: aboutTableFacts
        });
      }

      // History.
      const historySection = {
        title: "History",
        cardType: "vertical_timeline",
        facts: HISTORY.map(historyItem => {
          if (!record[historyItem.TITLE_KEY]) {
            return null;
          }

          return {
            label: record[historyItem.TITLE_KEY],
            id: getSluggedTitle(historyItem.TITLE_KEY),
            note: record[historyItem.TIME_PERIOD_KEY],
            value: {
              label: record[historyItem.DESCRIPTION_KEY]
            }
          };
        }).filter(f => !!f)
      };

      if (historySection.facts.length > 0) {
        place.sections.push(historySection);
      }

      // Government.
      let governmentFacts = await Promise.all(
        GOVERNMENT_PEOPLE.map(async person => {
          if (!record[person.NAME_KEY]) {
            return null;
          }

          return {
            label: person.NAME_KEY,
            value: {
              label: record[person.NAME_KEY],
              image: await downloadImageAndFillAttributions(
                {
                  url: record[person.IMAGE_KEY],
                  altText: `Picture of ${record[person.NAME_KEY]}`
                },
                englishSlug
              )
            }
          };
        })
      );

      governmentFacts = governmentFacts.filter(f => !!f);

      if (governmentFacts.length > 0) {
        place.sections.push({
          title: "Government",
          cardType: "avatar",
          label: record[GOVERNMENT_KEY],
          facts: governmentFacts
        });
      }

      // In sports.
      let inSportsFacts = await Promise.all(
        IN_SPORTS.map(async inSport => {
          if (!record[inSport.KEY]) {
            return null;
          }

          const card = getCardInfoFromId(idMap, record[inSport.KEY], lang);

          if (!card) {
            return null;
          }

          return {
            label: inSport.isPlayer ? "Player" : "Team",
            value: {
              label: card.title,
              url: card.url,
              contentUrl: card.contentUrl,
              image: await downloadImageAndFillAttributions(
                {
                  url: card.imageUrl,
                  altText: `Picture of ${card.title}`
                },
                englishSlug
              )
            }
          };
        })
      );

      inSportsFacts = inSportsFacts.filter(f => !!f);

      if (inSportsFacts.length > 0) {
        place.sections.push({
          title: "In Sports",
          cardType: "avatar",
          label: "",
          facts: inSportsFacts
        });
      }

      // Geography.
      if (record[GEOGRAPHY_KEY]) {
        const geographyImage = await downloadImageAndFillAttributions(
          {
            url: record[GEOGRAPHY_IMAGE_KEY],
            altText: `An image of ${place.title}`
          },
          englishSlug
        );

        place.sections.push({
          title: "Geography",
          id: getSluggedTitle(`${englishSlug}_geography`),
          cardType: "simple",
          facts: [
            {
              label: place.title,
              value: {
                label: record[GEOGRAPHY_KEY],
                image: geographyImage
              }
            }
          ]
        });
      }

      // Culture.

      // Demographics.

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(place, null, 2)
      );
    });
  });
};
