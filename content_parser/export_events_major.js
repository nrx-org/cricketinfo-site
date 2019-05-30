const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const {
  findIdMapEntryById,
  getSluggedTitle,
  downloadImageAndFillAttributions,
  getCardInfoFromId
} = require("./lib");
const idMap = require("../static/content/article_ids.json");
const { eventsUiStrings } = require("./ui_strings");

const csvExports = {
  en: { path: "./csv/events_major.en.csv" },
  hi: { path: "./csv/events_major.hi.csv" },
  ta: { path: "./csv/events_major.ta.csv" }
};

const ID_KEY = "Article Link ID";
const TITLE_KEY = "Name of tournament";
const SUMMARY_KEY = "Short summary of the article";
const WIKIPEDIA_URL_KEY = "Wikipedia link of the Tournament";
const COVER_IMAGE_KEY = "Header  image ";
const CHAMPION_KEY = "Current champions";
const CHAMPION_ID_KEY = "Article Code for Current Champions";
const DATES_KEY = "First edition Year";
const FORMAT_KEY = "Format of the tournament";
const NUMBER_OF_TEAMS_KEY = "No of Teams";
const MOST_SUCCESSFUL_KEY = "Most successful Team";
const MOST_SUCCESSFUL_ID_KEY = "Article Code for Most successful Team";

const EVENTS = [
  {
    YEAR_KEY: "Year 1",
    TITLE_KEY: "Title 1",
    DESCRIPTION_KEY: "Short description 1",
    CARD_ID_KEY: "Card 1 ID"
  },
  {
    YEAR_KEY: "Year 2",
    TITLE_KEY: "Title 2",
    DESCRIPTION_KEY: "Short description 2",
    CARD_ID_KEY: "Card 2 ID"
  },
  {
    YEAR_KEY: "Year 3",
    TITLE_KEY: "Title 3",
    DESCRIPTION_KEY: "Short description 3",
    CARD_ID_KEY: "Card 3 ID"
  },
  {
    YEAR_KEY: "Year 4",
    TITLE_KEY: "Title 4",
    DESCRIPTION_KEY: "Short description 4",
    CARD_ID_KEY: "Card 4 ID"
  }
];

const STATISTICS = [
  {
    STATISTIC_KEY: "Most Runs scored- Name of the player",
    COUNTRY_KEY: "Country of the player",
    IMAGE_KEY: "Link to image of the player"
  }
];

module.exports.exportEventsMajor = () => {
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
      const championCard = getCardInfoFromId(
        idMap,
        record[CHAMPION_ID_KEY],
        lang
      );

      const mostSuccessfulIds = record[MOST_SUCCESSFUL_ID_KEY].split(",");
      const mostSuccessfulCards = mostSuccessfulIds
        .map(id => getCardInfoFromId(idMap, id, lang))
        .filter(c => !!c);

      const aboutTable = {
        title: eventsUiStrings.about[lang],
        cardType: "table",
        facts: [
          {
            label: eventsUiStrings[DATES_KEY][lang],
            value: {
              label: record[DATES_KEY]
            }
          },
          {
            label: eventsUiStrings[FORMAT_KEY][lang],
            value: {
              label: record[FORMAT_KEY]
            }
          },
          {
            label: eventsUiStrings[CHAMPION_KEY][lang],
            value: {
              label: record[CHAMPION_KEY],
              url: championCard && championCard.url,
              contentUrl: championCard && championCard.contentUrl
            }
          },
          {
            label: eventsUiStrings[MOST_SUCCESSFUL_KEY][lang],
            value: {
              label: mostSuccessfulCards.map(c => c.title).join(", ")
            }
          },
          {
            label: eventsUiStrings[NUMBER_OF_TEAMS_KEY][lang],
            value: {
              label: record[NUMBER_OF_TEAMS_KEY]
            }
          }
        ]
      };

      event.sections.push(aboutTable);

      // Events.
      const eventsSection = {
        title: eventsUiStrings.events[lang],
        cardType: "vertical_timeline",
        facts: await Promise.all(
          EVENTS.map(async mapEvent => {
            if (!record[mapEvent.TITLE_KEY]) {
              return null;
            }

            const eventCard = getCardInfoFromId(
              idMap,
              record[mapEvent.CARD_ID_KEY],
              lang
            );

            let eventCardImage = null;
            if (eventCard) {
              eventCardImage = await downloadImageAndFillAttributions(
                {
                  url: eventCard.imageUrl,
                  altText: `Image of ${eventCard.title}`
                },
                englishSlug
              );
            }

            return {
              label: record[mapEvent.TITLE_KEY],
              note: record[mapEvent.YEAR_KEY],
              id: getSluggedTitle(record[mapEvent.TITLE_KEY]),
              value: {
                label: record[mapEvent.DESCRIPTION_KEY],
                facts: [
                  eventCard && {
                    label: eventCard.title,
                    url: eventCard.url,
                    contentUrl: eventCard.contentUrl,
                    id: getSluggedTitle(eventCard.title),
                    value: {
                      label: eventCard.summary,
                      image: eventCardImage
                    }
                  }
                ].filter(f => !!f)
              }
            };
          })
        )
      };

      event.sections.push(eventsSection);

      // Statistics.
      let statisticsFacts = await Promise.all(
        STATISTICS.map(async stat => {
          if (!record[stat.STATISTIC_KEY]) {
            return null;
          }

          return {
            label: eventsUiStrings[stat.STATISTIC_KEY][lang],
            id: getSluggedTitle(stat.STATISTIC_KEY),
            value: {
              label: `${record[stat.STATISTIC_KEY]}, ${
                record[stat.COUNTRY_KEY]
              }`,
              image: await downloadImageAndFillAttributions(
                {
                  url: record[stat.IMAGE_KEY],
                  altText: `Picture of ${record[stat.STATISTIC_KEY]}`
                },
                englishSlug
              )
            }
          };
        })
      );

      statisticsFacts = statisticsFacts.filter(f => !!f);

      if (statisticsFacts.length > 0) {
        event.sections.push({
          title: eventsUiStrings.statistics[lang],
          cardType: "stories",
          facts: statisticsFacts
        });
      }

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(event, null, 2)
      );
    });
  });
};
