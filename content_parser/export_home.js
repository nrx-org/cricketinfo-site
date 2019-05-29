const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const { parse: parseDate, format } = require("date-fns");

const idMap = require("../static/content/article_ids.json");
const {
  getSluggedTitle,
  downloadImageAndFillAttributions,
  getCardInfoFromId
} = require("./lib");

const csvExports = {
  en: {
    facts: { path: "./csv/home_facts.en.csv" },
    quiz: { path: "./csv/home_quiz.en.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" },
    featured_players: { path: "./csv/home_featured_players.csv" }
  },
  hi: {
    facts: { path: "./csv/home_facts.hi.csv" },
    quiz: { path: "./csv/home_quiz.hi.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" },
    featured_players: { path: "./csv/home_featured_players.csv" }
  },
  ta: {
    facts: { path: "./csv/home_facts.ta.csv" },
    quiz: { path: "./csv/home_quiz.ta.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" },
    featured_players: { path: "./csv/home_featured_players.csv" }
  }
};

// Home page strategy (home_strategy.[lang].csv)
const HOME_STRATEGY_DATE = "Date";
const HOME_STRATEGY_PLAYER_TO_WATCH_1 = "Player to watch - 1";
const HOME_STRATEGY_PLAYER_TO_WATCH_2 = "Player to watch - 2";
const HOME_STRATEGY_PLAYER_TO_WATCH_3 = "Player to watch - 3";

// Home page quiz data (home_quiz.[lang].csv)
const HOME_QUIZ_QNO = "Q. No";
const HOME_QUIZ_QUESTIONS = "Questions";
const HOME_QUIZ_ANSWER_A = "Answer A";
const HOME_QUIZ_ANSWER_B = "Answer B";
const HOME_QUIZ_CORRECT_ANSWER = "Correct Answer"; // Modified column name
const HOME_QUIZ_ARTICLE_ID = "Article ID";

// Home page facts data (home_facts.[lang].csv)
const HOME_FACTS_FACTID = "Fact Id";
const HOME_FACTS_RELEVANT_IMAGE = "Relevant Image";
const HOME_FACTS_HEADING = "Heading";
const HOME_FACTS_FACT = "Fact";
const HOME_FACTS_LINKING_ARTICLE = "Linking article";

const HOME_POPULAR_ARTICLES_ARTICLEID = "Article Code";
const HOME_INTERESTING_ARTICLES_ARTICLEID = "Article Code";

const groupArr = (data, n) => {
  const group = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = 0; i < data.length; i++) {
    // eslint-disable-next-line no-plusplus
    if (i >= n && i % n === 0) j++;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
};

const flatten = arr => {
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );
};

module.exports.exportHome = () => {
  Object.keys(csvExports).forEach(async lang => {
    const homeJSON = {};

    // eslint-disable-next-line default-case
    switch (lang) {
      case "en":
        homeJSON.translations = [
          {
            url: "/read/hi",
            title: "हिंदी में पढ़े"
          },
          {
            url: "/read/ta",
            title: "தமிழ் படிக்கவும்"
          }
        ];
        break;
      case "hi":
        homeJSON.translations = [
          {
            url: "/read/en",
            title: "Read in English"
          },
          {
            url: "/read/ta",
            title: "தமிழ் படிக்கவும்"
          }
        ];
        break;
      case "ta":
        homeJSON.translations = [
          {
            url: "/read/hi",
            title: "हिंदी में पढ़े"
          },
          {
            url: "/read/en",
            title: "Read in English"
          }
        ];
        break;
    }

    homeJSON.participatingTeams = [];
    homeJSON.playingTeams = [
      {
        label: "India",
        date: "2019-05-21",
        id: "0",
        value: {
          label:
            "Also known as Team India and Men in Blue, the Indian cricket team likes to play cricket.",
          url: "/wiki/en/Team_India",
          image: {
            url: "/static/images/india.png",
            altText: "An image of the Indian flag",
            license:
              "Creative Commons Attribution-Share Alike 4.0 International",
            licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.en"
          }
        }
      },
      {
        label: "England",
        date: "2019-05-21",
        id: "1",
        value: {
          label:
            "Represents England and Wales in international cricket and drinks too much tea.",
          url: "/wiki/en/Team_England",
          image: {
            url:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Flag_of_England.svg/320px-Flag_of_England.svg.png",
            altText: "An image of the English flag",
            license:
              "Creative Commons Attribution-Share Alike 4.0 International",
            licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.en"
          }
        }
      },
      {
        label: "Australia",
        date: "2019-05-22",
        id: "2",
        value: {
          label:
            "Celebrates Christmas in the summer and is constantly in danger of being bitten by poisonous animals.",
          url: "/wiki/en/Team_Koala",
          image: {
            url:
              "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Australia.svg",
            altText: "An image of the Australian flag",
            license:
              "Creative Commons Attribution-Share Alike 4.0 International",
            licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.en"
          }
        }
      },
      {
        label: "Pakistan",
        date: "2019-05-22",
        id: "2",
        value: {
          label:
            "Popularly referred to as the Shaheens, Green Shirts and Men in Green. They are ranked seventh in Tests, sixth in ODIs and first in T20Is.",
          url: "/wiki/en/Team_Rocket",
          image: {
            url:
              "https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg",
            altText: "An image of the Pakistani flag"
          }
        }
      }
    ];

    homeJSON.horizontalTimeline = {
      title: "History of the World Cup",
      id: 2,
      facts: [
        {
          label: "1975",
          id: "worldCupHistory1975",
          note: null,
          value: {
            label: "",
            facts: [
              {
                label: "1983 Cricket World Cup",
                id: "worldCupHistory1975",
                value: {
                  label:
                    "India won their first world cup in 1983 under Kapil Dev beating West Indies by 43 runs.",
                  url: "https://placekitten.com/200/200",
                  buttonText: "Know More",
                  image: {
                    url: "https://placekitten.com/200/200",
                    altText: "Kitten mata ki jai"
                  }
                }
              }
            ]
          }
        },
        {
          label: "1983",
          id: "worldCupHistory1983",
          note: null,
          value: {
            label: "",
            facts: [
              {
                label: "1983 Cricket World Cup",
                id: "worldCupHistory1983",
                value: {
                  label:
                    "India won their first world cup in 1983 under Kapil Dev beating West Indies by 43 runs.",
                  url: "https://placekitten.com/200/200",
                  buttonText: "Know More",
                  image: {
                    url: "https://placekitten.com/200/200",
                    altText: "Kitten mata ki jai"
                  }
                }
              }
            ]
          }
        },
        {
          label: "1992",
          id: "worldCupHistory1992",
          note: null,
          value: {
            label: "",
            facts: [
              {
                label: "1983 Cricket World Cup",
                id: "worldCupHistory1992",
                value: {
                  label:
                    "India won their first world cup in 1983 under Kapil Dev beating West Indies by 43 runs.",
                  url: "https://placekitten.com/200/200",
                  buttonText: "Know More",
                  image: {
                    url: "https://placekitten.com/200/200",
                    altText: "Kitten mata ki jai"
                  }
                }
              }
            ]
          }
        }
      ]
    };

    const factsFileContent = fs.readFileSync(
      csvExports[lang].facts.path,
      "utf8"
    );
    const quizFileContent = fs.readFileSync(csvExports[lang].quiz.path, "utf8");
    const strategyFileContent = fs.readFileSync(
      csvExports[lang].strategy.path,
      "utf8"
    );
    const popularArticlesFileContent = fs.readFileSync(
      csvExports[lang].popular_articles.path,
      "utf8"
    );
    const interestingArticlesFileContent = fs.readFileSync(
      csvExports[lang].interesting_articles.path,
      "utf8"
    );

    let factRecords = parse(factsFileContent, {
      columns: true,
      delimiter: ","
    });
    const quizRecords = parse(quizFileContent, {
      columns: true,
      delimiter: ","
    });
    const strategyRecords = parse(strategyFileContent, {
      columns: true,
      delimiter: ","
    });
    const popularArticlesRecords = parse(popularArticlesFileContent, {
      columns: true,
      delimiter: ","
    });
    const interestingArticlesRecords = parse(interestingArticlesFileContent, {
      columns: true,
      delimiter: ","
    });

    const getDatesForIDFromStrategySheet = (id, type) => {
      const dates = [];

      let arrayToCheck = null;

      strategyRecords.forEach((strategyRecord, index) => {
        /* eslint-disable no-eval */
        if (type === "STRATEGY_PLAYER_TO_WATCH")
          arrayToCheck = [
            strategyRecord[eval(`HOME_STRATEGY_${type}_1`)],
            strategyRecord[eval(`HOME_STRATEGY_${type}_2`)],
            strategyRecord[eval(`HOME_STRATEGY_${type}_3`)]
          ];
        else
          arrayToCheck = [
            strategyRecord[eval(`HOME_STRATEGY_${type}_1`)],
            strategyRecord[eval(`HOME_STRATEGY_${type}_2`)]
          ];
        /* eslint-enable no-eval */

        if (arrayToCheck.indexOf(id) > -1) {
          let recordDateString = strategyRecord[HOME_STRATEGY_DATE];
          if (!recordDateString.length) {
            recordDateString = strategyRecords[index - 1][HOME_STRATEGY_DATE];
          }
          dates.push(
            format(
              parseDate(
                `${recordDateString.split(",")[0]} 2019`,
                "MMM dd yyyy",
                new Date(),
                { awareOfUnicodeTokens: true }
              ),
              "yyyy-MM-dd",
              { awareOfUnicodeTokens: true }
            )
          );
        }
      });
      return dates;
    };

    // NEEDS TO BE CHANGED - NEED BETTER FACT -> ARTICLE MAPPING IN THE CSV

    factRecords = await Promise.all(
      factRecords.map(async factRecord => {
        const articleInfo = getCardInfoFromId(
          idMap,
          factRecord[HOME_FACTS_LINKING_ARTICLE],
          lang
        );
        return {
          label: factRecord[HOME_FACTS_FACT],
          dates: getDatesForIDFromStrategySheet(
            factRecord[HOME_FACTS_FACTID],
            "FACT_OF_THE_DAY"
          ),
          id: factRecord[HOME_FACTS_FACTID],
          value: {
            url: articleInfo ? articleInfo.url : null,
            image: await downloadImageAndFillAttributions(
              {
                url: factRecord[HOME_FACTS_RELEVANT_IMAGE],
                altText: `Image for ${factRecord[HOME_FACTS_HEADING]}`
              },
              "home"
            )
          }
        };
      })
    );

    homeJSON.constantFacts = [];
    homeJSON.scheduledFacts = factRecords.filter(
      factRecord => factRecord.dates.length > 0
    );

    homeJSON.quizQuestions = await Promise.all(
      quizRecords.map(async quizRecord => {
        const relatedArticleInfo = getCardInfoFromId(
          idMap,
          quizRecord[HOME_QUIZ_ARTICLE_ID],
          lang
        );

        return {
          label: quizRecord[HOME_QUIZ_QUESTIONS],
          id: getSluggedTitle(quizRecord[HOME_QUIZ_QUESTIONS]),
          dates: getDatesForIDFromStrategySheet(
            quizRecord[HOME_QUIZ_QNO],
            "QUIZ_OF_THE_DAY"
          ),
          options: [
            {
              label: quizRecord[HOME_QUIZ_ANSWER_A]
            },
            {
              label: quizRecord[HOME_QUIZ_ANSWER_B]
            }
          ],
          answerIndex: quizRecord[HOME_QUIZ_CORRECT_ANSWER] === "A" ? 0 : 1,
          relatedArticle: relatedArticleInfo
            ? {
                label: relatedArticleInfo.title,
                value: {
                  label: relatedArticleInfo.summary,
                  url: relatedArticleInfo.url,
                  image: await downloadImageAndFillAttributions(
                    {
                      url: relatedArticleInfo.imageUrl,
                      altText: `Image for ${relatedArticleInfo.title}`
                    },
                    "home"
                  )
                }
              }
            : null
        };
      })
    );

    homeJSON.popularArticles = {
      title: "Popular Articles",
      id: "popularArticlesHome",
      columns: []
    };

    homeJSON.popularArticles.columns = groupArr(
      (await Promise.all(
        popularArticlesRecords.map(async popularArticlesRecord => {
          const articleInfo = getCardInfoFromId(
            idMap,
            popularArticlesRecord[HOME_POPULAR_ARTICLES_ARTICLEID],
            lang
          );

          return articleInfo
            ? {
                label: articleInfo.title,
                id: popularArticlesRecord[HOME_POPULAR_ARTICLES_ARTICLEID],
                url: articleInfo.url,
                value: {
                  label: articleInfo.summary,
                  image: await downloadImageAndFillAttributions(
                    {
                      url: articleInfo.imageUrl,
                      altText: `Image for ${articleInfo.title}`
                    },
                    "home"
                  )
                }
              }
            : null;
        })
      )).filter(Boolean),
      4
    );

    homeJSON.interestingArticles = (await Promise.all(
      interestingArticlesRecords.map(async interestingArticlesRecord => {
        const articleInfo = getCardInfoFromId(
          idMap,
          interestingArticlesRecord[HOME_INTERESTING_ARTICLES_ARTICLEID],
          lang
        );
        return articleInfo
          ? {
              label: articleInfo.title,
              id:
                interestingArticlesRecord[HOME_INTERESTING_ARTICLES_ARTICLEID],
              value: {
                url: articleInfo.url,
                label: articleInfo.summary,
                image: await downloadImageAndFillAttributions(
                  {
                    url: articleInfo.imageUrl,
                    altText: `Image for ${articleInfo.title}`
                  },
                  "home"
                )
              }
            }
          : null;
      })
    )).filter(Boolean);

    let featuredPlayers = strategyRecords.map(strategyRecord => {
      return [
        strategyRecord[HOME_STRATEGY_PLAYER_TO_WATCH_1],
        strategyRecord[HOME_STRATEGY_PLAYER_TO_WATCH_2],
        strategyRecord[HOME_STRATEGY_PLAYER_TO_WATCH_3].length
          ? strategyRecord[HOME_STRATEGY_PLAYER_TO_WATCH_3]
          : null
      ];
    });

    featuredPlayers = flatten(featuredPlayers).filter(Boolean);
    featuredPlayers = [...new Set(featuredPlayers)];

    homeJSON.allPlayers = (await Promise.all(
      featuredPlayers.map(async featuredPlayer => {
        const articleInfo = getCardInfoFromId(idMap, featuredPlayer, lang);

        return articleInfo
          ? {
              label: articleInfo.title,
              id: getSluggedTitle(articleInfo.title),
              value: {
                url: articleInfo.url,
                label: articleInfo.summary,
                image: await downloadImageAndFillAttributions(
                  {
                    url: articleInfo.imageUrl,
                    altText: `Image for ${articleInfo.title}`
                  },
                  "home"
                )
              }
            }
          : null;
      })
    )).filter(Boolean);

    homeJSON.constantFeaturedPlayers = [];
    homeJSON.scheduledFeaturedPlayers = (await Promise.all(
      featuredPlayers.map(async featuredPlayer => {
        const articleInfo = getCardInfoFromId(idMap, featuredPlayer, lang);

        const dates = getDatesForIDFromStrategySheet(
          featuredPlayer,
          "PLAYER_TO_WATCH"
        );

        return articleInfo && dates.length
          ? {
              label: articleInfo.title,
              id: getSluggedTitle(articleInfo.title),
              dates,
              value: {
                url: articleInfo.url,
                label: articleInfo.summary,
                image: await downloadImageAndFillAttributions(
                  {
                    url: articleInfo.imageUrl,
                    altText: `Image for ${articleInfo.title}`
                  },
                  "home"
                )
              }
            }
          : null;
      })
    )).filter(Boolean);

    fs.writeFileSync(
      `./static/content/${lang}/home.json`,
      JSON.stringify(homeJSON, null, 2)
    );
  });
};
