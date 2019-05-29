const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const {
  findIdMapEntryById,
  getSluggedTitle,
  downloadImageAndFillAttributions,
  getCardInfoFromId
} = require("./lib");
const idMap = require("../static/content/article_ids.json");
const { teamUIStrings } = require("./ui_strings");

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
      let statisticsFacts = await Promise.all(
        STATISTICS.map(async stat => {
          if (!record[stat.STATISTIC_KEY]) {
            return null;
          }

          return {
            label: stat.STATISTIC_KEY,
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
          title: teamUIStrings.statisticsSectionTitle[lang],
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
            label: "Champion",
            id: "final-positions-champion",
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
            label: "Runner-up",
            id: "final-positions-runner-up",
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

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(event, null, 2)
      );
    });
  });
};
