const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const {
  findIdMapEntryById,
  getSluggedTitle,
  downloadImageAndFillAttributions,
  getCardInfoFromId
} = require("./lib");
const idMap = require("../static/content/article_ids.json");
const { eventsUiStrings, teamUIStrings } = require("./ui_strings");

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

const HISTORY = [
  {
    YEAR_KEY: "Tournament year 1",
    TOURNAMENT_ID_KEY: "Tournament Year 1 Card",
    WINNER_ID_KEY: "Winner 1 Card"
  },
  {
    YEAR_KEY: "Tournament year 2",
    TOURNAMENT_ID_KEY: "Tournament Year 2 Card",
    WINNER_ID_KEY: "Winner Card 2"
  },
  {
    YEAR_KEY: "Tournament year 3",
    TOURNAMENT_ID_KEY: "Tournament Year 3 Card",
    WINNER_ID_KEY: "Winner Card 3"
  },
  {
    YEAR_KEY: "Tournament year 4",
    TOURNAMENT_ID_KEY: "Tournament Year 4 Card",
    WINNER_ID_KEY: "Winner Card 4"
  },
  {
    YEAR_KEY: "Tournament year 5",
    TOURNAMENT_ID_KEY: "Tournament Year 5 Card",
    WINNER_ID_KEY: "Winner Card 5"
  },
  {
    YEAR_KEY: "Tournament year 6",
    TOURNAMENT_ID_KEY: "Tournament Year 6 Card",
    WINNER_ID_KEY: "Winner Card 6"
  },
  {
    YEAR_KEY: "Tournament year 7",
    TOURNAMENT_ID_KEY: "Tournament year 7 Card",
    WINNER_ID_KEY: "Winner Card 7"
  },
  {
    YEAR_KEY: "Tournament year 8",
    TOURNAMENT_ID_KEY: "Tournament year 8 Card",
    WINNER_ID_KEY: "Winner Card 8"
  },
  {
    YEAR_KEY: "Tournament year 9",
    TOURNAMENT_ID_KEY: "Tournament Year 9 Card",
    WINNER_ID_KEY: "Winner Card 9"
  },
  {
    YEAR_KEY: "Tournament year 10",
    TOURNAMENT_ID_KEY: "Tournament Year 10 Card",
    WINNER_ID_KEY: "Winner Card 10"
  },
  {
    YEAR_KEY: "Tournament year 11",
    TOURNAMENT_ID_KEY: "Tournament Year 11 Card",
    WINNER_ID_KEY: "Winner Card 11"
  },
  {
    YEAR_KEY: "Tournament year 12",
    TOURNAMENT_ID_KEY: "Tournament Year 12 Card",
    WINNER_ID_KEY: "Winner Card 12"
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

      // History.
      let historyFacts = await Promise.all(
        HISTORY.map(async history => {
          if (
            !record[history.TOURNAMENT_ID_KEY] &&
            !record[history.WINNER_ID_KEY]
          ) {
            return null;
          }

          const tournamentCard = getCardInfoFromId(
            idMap,
            record[history.TOURNAMENT_ID_KEY],
            lang
          );
          const winnerCard = getCardInfoFromId(
            idMap,
            record[history.WINNER_ID_KEY],
            lang
          );

          if (!tournamentCard && !winnerCard) {
            return null;
          }

          let timelineCards = [
            tournamentCard && {
              label: tournamentCard.title,
              url: tournamentCard.url,
              contentUrl: tournamentCard.contentUrl,
              id: `tournament_card_${getSluggedTitle(tournamentCard.title)}`,
              value: {
                label: eventsUiStrings.tournament[lang],
                image: await downloadImageAndFillAttributions(
                  {
                    url: tournamentCard.imageUrl,
                    altText: `Image of ${tournamentCard.title}`
                  },
                  englishSlug
                )
              }
            },
            winnerCard && {
              label: winnerCard.title,
              url: winnerCard.url,
              contentUrl: winnerCard.contentUrl,
              id: `winner_card_${getSluggedTitle(winnerCard.title)}`,
              value: {
                label: eventsUiStrings.champion[lang],
                image: await downloadImageAndFillAttributions(
                  {
                    url: winnerCard.imageUrl,
                    altText: `Image of ${winnerCard.title}`
                  },
                  englishSlug
                )
              }
            }
          ];

          timelineCards = timelineCards.filter(tc => !!tc);

          return {
            label: record[history.YEAR_KEY],
            id: `tournament_year_${record[history.YEAR_KEY]}`,
            value: {
              label: "",
              facts: timelineCards
            }
          };
        })
      );

      historyFacts = historyFacts.filter(f => !!f);

      if (historyFacts.length > 0) {
        event.sections.push({
          title: teamUIStrings.historySectionTitle[lang],
          cardType: "horizontal_timeline",
          facts: historyFacts
        });
      }

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

      event.category = "tournament_major";

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(event, null, 2)
      );
    });
  });
};
