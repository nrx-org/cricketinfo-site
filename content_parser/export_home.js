const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const { parse: parseDate, format } = require("date-fns");
const shortid = require("shortid");

const fetch = require("isomorphic-fetch");
const path = require("path");

const idMap = require("../static/content/article_ids.json");
const {
  findIdMapEntryById,
  getSluggedTitle,
  makeContentUrl,
  makeArticleUrl,
  downloadImageAndFillAttributions,
  findIdMapEntryByTitle,
  getCardInfoFromId
} = require("./lib");

const csvExports = {
  en: {
    facts: { path: "./csv/home_facts.en.csv" },
    quiz: { path: "./csv/home_quiz.en.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" },
    featured_players: { path: "./csv/home_featured_players.csv" },
    history: { path: "./csv/home_history.csv" }
  },
  hi: {
    facts: { path: "./csv/home_facts.hi.csv" },
    quiz: { path: "./csv/home_quiz.hi.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" },
    featured_players: { path: "./csv/home_featured_players.csv" },
    history: { path: "./csv/home_history.csv" }
  },
  ta: {
    facts: { path: "./csv/home_facts.ta.csv" },
    quiz: { path: "./csv/home_quiz.ta.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" },
    featured_players: { path: "./csv/home_featured_players.csv" },
    history: { path: "./csv/home_history.csv" }
  }
};

// Home page strategy (home_strategy.[lang].csv)
const HOME_STRATEGY_DATE = "Date";
const HOME_STRATEGY_TIME = "Time";
const HOME_STRATEGY_VENUE = "Venue";
const HOME_STRATEGY_TEAM_TO_WATCH_1 = "Team to watch - 1";
const HOME_STRATEGY_TEAM_TO_WATCH_2 = "Team to watch - 2";
const HOME_STRATEGY_PLAYER_TO_WATCH_1 = "Player to watch - 1";
const HOME_STRATEGY_PLAYER_TO_WATCH_2 = "Player to watch - 2";
const HOME_STRATEGY_PLAYER_TO_WATCH_3 = "Player to watch - 3";
const HOME_STRATEGY_FACT_OF_THE_DAY_1 = "Fact of the day - 1";
const HOME_STRATEGY_FACT_OF_THE_DAY_2 = "Fact of the day - 2";
const HOME_STRATEGY_QUIZ_OF_THE_DAY_1 = "Quiz of the day -1"; // Modified column name
const HOME_STRATEGY_QUIZ_OF_THE_DAY_2 = "Quiz of the day -2"; // Modified column name

// Home page quiz data (home_quiz.[lang].csv)
const HOME_QUIZ_QNO = "Q. No";
const HOME_QUIZ_QUESTIONS = "Questions";
const HOME_QUIZ_ANSWER_A = "Answer A";
const HOME_QUIZ_ANSWER_B = "Answer B";
const HOME_QUIZ_CORRECT_ANSWER = "Correct Answer"; // Modified column name
const HOME_QUIZ_LEADING_ARTICLE = "Leading Article";
const HOME_QUIZ_ARTICLE_ID = "Article ID";

// Home page facts data (home_facts.[lang].csv)
const HOME_FACTS_FACTID = "Fact Id";
const HOME_FACTS_RELEVANT_IMAGE = "Relevant Image";
const HOME_FACTS_HEADING = "Heading";
const HOME_FACTS_FACT = "Fact";
const HOME_FACTS_READ_MORE_TEXT = "Read More Text"; // Modified column name
const HOME_FACTS_LINKING_ARTICLE = "Linking article";
const HOME_FACTS_ARTICLE_ID = "Article ID";

const HOME_POPULAR_ARTICLES_ARTICLEID = "Article Code";
const HOME_INTERESTING_ARTICLES_ARTICLEID = "Article Code";
const HOME_FEATURED_PLAYERS_ARTICLEID = "Article Code";
const HOME_HISTORY_ARTICLEID = "Article Code";

const groupArr = (data, n) => {
  let group = [];
  for (let i = 0, j = 0; i < data.length; i++) {
    if (i >= n && i % n === 0) j++;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
};

const flatten = arr => {
  return arr.reduce(function(flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
};

module.exports.exportHome = () => {
  Object.keys(csvExports).forEach(async lang => {
    let homeJSON = {};

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
    const historyFileContent = fs.readFileSync(
      csvExports[lang].history.path,
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
    const historyRecords = parse(historyFileContent, {
      columns: true,
      delimiter: ","
    });

    const getDatesForIDFromStrategySheet = (id, type) => {
      let dates = [];

      let arrayToCheck = null;

      strategyRecords.forEach((strategyRecord, index) => {
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

        if (arrayToCheck.indexOf(id) > -1) {
          let recordDateString = strategyRecord[HOME_STRATEGY_DATE];
          if (!recordDateString.length) {
            recordDateString = strategyRecords[index - 1][HOME_STRATEGY_DATE];
          }
          dates.push(
            format(
              parseDate(
                recordDateString.split(",")[0] + " 2019",
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

    let participatingTeams = strategyRecords.map(strategyRecord => {
      return [
        strategyRecord[HOME_STRATEGY_TEAM_TO_WATCH_1],
        strategyRecord[HOME_STRATEGY_TEAM_TO_WATCH_2]
      ];
    });

    participatingTeams = flatten(participatingTeams).filter(Boolean);
    participatingTeams = [...new Set(participatingTeams)];

    homeJSON.participatingTeams = (await Promise.all(
      participatingTeams.map(async participatingTeam => {
        const articleInfo = getCardInfoFromId(idMap, participatingTeam, lang);

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

    homeJSON.playingTeams = (await Promise.all(
      participatingTeams.map(async participatingTeam => {
        const articleInfo = getCardInfoFromId(idMap, participatingTeam, lang);

        const dates = getDatesForIDFromStrategySheet(
          participatingTeam,
          "TEAM_TO_WATCH"
        );

        return articleInfo && dates.length
          ? {
              label: articleInfo.title,
              id: getSluggedTitle(articleInfo.title),
              dates: dates,
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

    homeJSON.horizontalTimeline = {
      title: "History of the World Cup",
      id: 2,
      facts: []
    };

    homeJSON.horizontalTimeline.facts = (await Promise.all(
      historyRecords.map(async historyRecord => {
        const articleInfo = getCardInfoFromId(
          idMap,
          historyRecord[HOME_HISTORY_ARTICLEID],
          lang
        );
        return articleInfo
          ? {
              label: articleInfo.title,
              id: historyRecord[HOME_HISTORY_ARTICLEID],
              value: {
                label: null,
                facts: [
                  {
                    label: articleInfo.title,
                    id: getSluggedTitle(articleInfo.title),
                    value: {
                      label: articleInfo.summary,
                      url: articleInfo.url,
                      buttonText: "Know More",
                      image: await downloadImageAndFillAttributions(
                        {
                          url: articleInfo.imageUrl,
                          altText: `Image for ${articleInfo.title}`
                        },
                        "home"
                      )
                    }
                  }
                ]
              }
            }
          : null;
      })
    )).filter(Boolean);

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
              dates: dates,
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
