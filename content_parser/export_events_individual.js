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
  en: { path: "./csv/events_individual.en.csv" },
  hi: { path: "./csv/events_individual.hi.csv" },
  ta: { path: "./csv/events_individual.ta.csv" }
};

const ID_KEY = "Article Link ID";
const TITLE_KEY = "Name of tournament";
const SUMMARY_KEY = "Short summary of the article";
const WIKIPEDIA_URL_KEY = "Wikipedia link of the Tournament";
const COVER_IMAGE_KEY = "Header  image ";
const CHAMPION_KEY = "Champion";
const CHAMPION_ID_KEY = "Champion Link";
const RUNNERS_UP_KEY = "Runners Up";
const RUNNERS_UP_ID_KEY = "Runners Up Link";
const DATES_KEY = "Dates";
const FORMAT_KEY = "Format";
const NUMBER_OF_TEAMS_KEY = "No of Teams";

const HOSTS = [
  {
    LABEL_KEY: "Host 1",
    ID_KEY: "Host 1 Card"
  },
  {
    LABEL_KEY: "Host 2",
    ID_KEY: "Host 2 Card"
  },
  {
    LABEL_KEY: "Host 3",
    ID_KEY: "Host 3 Card"
  }
];

module.exports.exportEventsIndividual = () => {
  Object.keys(csvExports).forEach(lang => {
    const fileContent = fs.readFileSync(csvExports[lang].path, "utf8");
    const records = parse(fileContent, { columns: true, delimiter: "," });

    records.forEach(async record => {
      const idTitleMap = findIdMapEntryById(idMap, record[ID_KEY]);
      const englishSlug = getSluggedTitle(idTitleMap.title.en);
      const event = {};

      event.title = record[TITLE_KEY];
      if (!event.title) {
        return;
      }

      event.summary = record[SUMMARY_KEY];
      event.wikipediaUrl = record[WIKIPEDIA_URL_KEY];
      event.coverImage = await downloadImageAndFillAttributions(
        {
          url: record[COVER_IMAGE_KEY],
          altText: `Image of ${event.title}`
        },
        englishSlug
      );

      const translationLanguages = Object.keys(csvExports).filter(
        l => l !== lang
      );

      event.translations = translationLanguages.map(tl => ({
        lang: tl,
        title: idTitleMap.title[tl],
        url: `/read/${tl}/${englishSlug}`
      }));

      event.sections = [];

      // About table.
      // TODO: this won't work until the homepage entry is removed from
      // the exports list in exports_map.js.
      const championCard = getCardInfoFromId(
        idMap,
        record[CHAMPION_ID_KEY],
        lang
      );
      const runnersUpCard = getCardInfoFromId(
        idMap,
        record[RUNNERS_UP_ID_KEY],
        lang
      );

      const aboutTable = {
        title: "About",
        cardType: "table",
        facts: [
          {
            label: DATES_KEY,
            value: {
              label: record[DATES_KEY]
            }
          },
          {
            label: FORMAT_KEY,
            value: {
              label: FORMAT_KEY
            }
          },
          {
            label: CHAMPION_KEY,
            value: {
              label: record[CHAMPION_KEY],
              url: championCard && championCard.url,
              contentUrl: championCard && championCard.contentUrl
            }
          },
          {
            label: RUNNERS_UP_KEY,
            value: {
              label: record[RUNNERS_UP_KEY],
              url: runnersUpCard && runnersUpCard.url,
              contentUrl: runnersUpCard && runnersUpCard.contentUrl
            }
          },
          {
            label: NUMBER_OF_TEAMS_KEY,
            value: {
              label: record[NUMBER_OF_TEAMS_KEY]
            }
          }
        ]
      };

      event.sections.push(aboutTable);

      // Hosts.
      let hostFacts = await Promise.all(
        HOSTS.map(async host => {
          if (!record[host.LABEL_KEY]) {
            return null;
          }

          const hostCard = getCardInfoFromId(idMap, record[host.ID_KEY], lang);

          if (!hostCard) {
            return null;
          }

          return {
            label: hostCard.title,
            url: hostCard.url,
            contentUrl: hostCard.contentUrl,
            value: {
              label: hostCard.summary,
              image: await downloadImageAndFillAttributions(
                {
                  url: hostCard.imageUrl,
                  altText: `${hostCard.title}`
                },
                englishSlug
              )
            }
          };
        })
      );

      hostFacts = hostFacts.filter(f => !!f);

      if (hostFacts.length > 0) {
        event.sections.push({
          title: "Hosts",
          cardType: "list_card",
          facts: [
            {
              label: "",
              id: getSluggedTitle(`host_card_${englishSlug}`),
              value: {
                label: "",
                facts: hostFacts
              }
            }
          ]
        });
      }

      // Tournament history.

      // Statistics.

      // Final positions.

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(event, null, 2)
      );
    });
  });
};
