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

const STATISTICS = [
  {
    STATISTIC_KEY: "Man of the series",
    IMAGE_KEY: "Link to the player's image",
    COUNTRY_KEY: "Country"
  },
  {
    STATISTIC_KEY: "Most runs scored/ Orange cap",
    IMAGE_KEY: "Link to player's image ",
    COUNTRY_KEY: "Country"
  },
  {
    STATISTIC_KEY: "Most wickets taken/ purple cap",
    IMAGE_KEY: "Link to the players image",
    COUNTRY_KEY: "Country"
  }
];

const FINAL_CHAMPION_KEY = "Champion Card ID";
const FINAL_RUNNER_UP_KEY = "Runner Up Card ID";

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
            label: eventsUiStrings[RUNNERS_UP_KEY][lang],
            value: {
              label: record[RUNNERS_UP_KEY],
              url: runnersUpCard && runnersUpCard.url,
              contentUrl: runnersUpCard && runnersUpCard.contentUrl
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
          title: eventsUiStrings.hosts[lang],
          cardType: "list_card",
          facts: [
            {
              label: "",
              id: `${englishSlug}_host_card`,
              value: {
                label: "",
                facts: hostFacts
              }
            }
          ]
        });
      }

      // Tournament history.
      let historyFacts = await Promise.all(
        HISTORY.map(async (history, index) => {
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

          let facts = [
            tournamentCard && {
              label: tournamentCard.title,
              url: tournamentCard.url,
              contentUrl: tournamentCard.contentUrl,
              id: `${englishSlug}_tournament_card_${index}`,
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
              id: `${englishSlug}_winner_card_${index}`,
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

          facts = facts.filter(f => !!f);

          return {
            label: record[history.YEAR_KEY],
            id: `${englishSlug}_tournament_year_${index}`,
            value: {
              label: "",
              facts
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
        STATISTICS.map(async (stat, index) => {
          if (!record[stat.STATISTIC_KEY]) {
            return null;
          }

          return {
            label: eventsUiStrings[stat.STATISTIC_KEY][lang],
            id: `${englishSlug}_statistic_${index}`,
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

      // Final positions.
      const finalChampionCard = getCardInfoFromId(
        idMap,
        record[FINAL_CHAMPION_KEY],
        lang
      );

      let finalChampionImage = null;

      if (finalChampionCard) {
        finalChampionImage = await downloadImageAndFillAttributions(
          {
            url: finalChampionCard.imageUrl,
            altText: `Picture of ${finalChampionCard.title}`
          },
          englishSlug
        );
      }

      const finalRunnerUpCard = getCardInfoFromId(
        idMap,
        record[FINAL_RUNNER_UP_KEY],
        lang
      );

      let finalRunnerUpImage = null;

      if (finalRunnerUpCard) {
        finalRunnerUpImage = await downloadImageAndFillAttributions(
          {
            url: finalRunnerUpCard.imageUrl,
            altText: `Picture of ${finalChampionCard.title}`
          },
          englishSlug
        );
      }

      const finalPositionsSection = {
        title: "Final Positions",
        cardType: "list_card",
        facts: [
          {
            label: eventsUiStrings.champion[lang],
            id: `${englishSlug}_final_positions_champion`,
            value: {
              label: "",
              facts: [
                finalChampionCard && {
                  label: finalChampionCard.title,
                  url: finalChampionCard.url,
                  contentUrl: finalChampionCard.contentUrl,
                  value: {
                    label: finalChampionCard.summary,
                    image: finalChampionImage
                  }
                }
              ].filter(f => !!f)
            }
          },
          {
            label: eventsUiStrings.runnerUp[lang],
            id: `${englishSlug}_final_position_runner_up`,
            value: {
              label: "",
              facts: [
                finalRunnerUpCard && {
                  label: finalRunnerUpCard.title,
                  url: finalRunnerUpCard.url,
                  contentUrl: finalRunnerUpCard.contentUrl,
                  value: {
                    label: finalRunnerUpCard.summary,
                    image: finalRunnerUpImage
                  }
                }
              ].filter(f => !!f)
            }
          }
        ]
      };

      event.sections.push(finalPositionsSection);

      event.category = "tournament_individual";

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(event, null, 2)
      );
    });
  });
};
