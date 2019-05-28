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
  getFileNameFromURL,
  findIdMapEntryByTitle,
  getCardInfoFromId
} = require("./lib");

const csvExports = {
  en: {
    facts: { path: "./csv/home_facts.en.csv" },
    quiz: { path: "./csv/home_quiz.en.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" }
  },
  hi: {
    facts: { path: "./csv/home_facts.hi.csv" },
    quiz: { path: "./csv/home_quiz.hi.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" }
  },
  ta: {
    facts: { path: "./csv/home_facts.ta.csv" },
    quiz: { path: "./csv/home_quiz.ta.csv" },
    strategy: { path: "./csv/home_strategy.csv" },
    popular_articles: { path: "./csv/home_popular_articles.csv" },
    interesting_articles: { path: "./csv/home_interesting_articles.csv" }
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

const groupArr = (data, n) => {
  let group = [];
  for (let i = 0, j = 0; i < data.length; i++) {
    if (i >= n && i % n === 0) j++;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
};

Object.keys(csvExports).forEach(async lang => {
  let homeJSON = require(`../static/content/home_schema.json`) || {};

  const factsFileContent = fs.readFileSync(csvExports[lang].facts.path, "utf8");
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

  let factRecords = parse(factsFileContent, { columns: true, delimiter: "," });
  const quizRecords = parse(quizFileContent, { columns: true, delimiter: "," });
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

  const getImagePathForArticle = async url => {
    // TODO: Why did this stop working in half the places?
    if (!url) {
      return "/static/images/default_person.svg";
    }
    // const response = await fetch(url);
    // const html = await response.text();
    // const $ = cheerio.load(html);
    // const imageURL = $(".fullMedia > p > a").attr("href");
    // if (!imageURL) {
    //   return null;
    // }
    const imageName = getFileNameFromURL(url);
    const imageDirectory = `./static/images/home`;
    const imagePath = `${imageDirectory}/${imageName}`;
    if (lang === "en") {
      const image = await fetch(url);
      // const image = await fetch(imageURL);
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdir(imageDirectory, err => {
          if (err) throw err;
        });
      }
      const imageFile = fs.createWriteStream(imagePath);
      image.body.pipe(imageFile);
    }
    return imagePath.substring(1);
  };

  const getFactsRecordsWithImagesDownloaded = async () => {
    return await Promise.all(
      factRecords.map(async record => {
        const imagePath = await getImagePathForArticle(
          record[HOME_FACTS_RELEVANT_IMAGE]
        );
        record[HOME_FACTS_RELEVANT_IMAGE] = imagePath;
        return record;
      })
    );
  };

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

  // NEEDS TO BE CHANGED - NEED BETTER FACT -> ARTICLE MAPPING IN THE CSV
  const getUrlFromArticleTitle = articleTitle => {
    // const idMapRecord = findIdMapEntryByTitle(idMap, articleTitle, lang);
    // console.log(articleTitle, idMapRecord && idMapRecord.title[lang]);
    const englishSlug = getSluggedTitle(articleTitle);
    return makeArticleUrl(lang, englishSlug);
  };

  factRecords = await getFactsRecordsWithImagesDownloaded();

  factRecords = factRecords.map(factRecord => ({
    label: factRecord[HOME_FACTS_HEADING],
    dates: getDatesForIDFromStrategySheet(
      factRecord[HOME_FACTS_FACTID],
      "FACT_OF_THE_DAY"
    ),
    id: factRecord[HOME_FACTS_FACTID],
    value: {
      url: getUrlFromArticleTitle(factRecord[HOME_FACTS_LINKING_ARTICLE]),
      image: {
        url: factRecord[HOME_FACTS_RELEVANT_IMAGE],
        altText: `Image for ${factRecord[HOME_FACTS_HEADING]}`
      }
    }
  }));

  homeJSON.scheduledFacts = factRecords.filter(
    factRecord => factRecord.dates.length > 0
  );

  homeJSON.quizQuestions = quizRecords.map(quizRecord => {
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
              image: {
                url: relatedArticleInfo.imageURL,
                altText: `Image for ${relatedArticleInfo.title}`,
                license:
                  "Creative Commons Attribution-Share Alike 4.0 International",
                licenseUrl:
                  "https://creativecommons.org/licenses/by-sa/4.0/deed.en"
              }
            }
          }
        : null
    };
  });

  homeJSON.popularArticles.columns = groupArr(
    popularArticlesRecords.map(popularArticlesRecord => {
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
              image: {
                url: articleInfo.imageURL,
                altText: `Image for ${articleInfo.title}`,
                license:
                  "Creative Commons Attribution-Share Alike 4.0 International",
                licenseUrl:
                  "https://creativecommons.org/licenses/by-sa/4.0/deed.en"
              }
            }
          }
        : null;
    }),
    4
  );

  homeJSON.interestingArticles = interestingArticlesRecords.map(
    interestingArticlesRecord => {
      const articleInfo = getCardInfoFromId(
        idMap,
        interestingArticlesRecord[HOME_INTERESTING_ARTICLES_ARTICLEID],
        lang
      );
      return articleInfo
        ? {
            label: articleInfo.title,
            id: interestingArticlesRecord[HOME_INTERESTING_ARTICLES_ARTICLEID],
            value: {
              url: articleInfo.url,
              label: articleInfo.summary,
              image: {
                url: articleInfo.imageURL,
                altText: `Image for ${articleInfo.title}`,
                license:
                  "Creative Commons Attribution-Share Alike 4.0 International",
                licenseUrl:
                  "https://creativecommons.org/licenses/by-sa/4.0/deed.en"
              }
            }
          }
        : null;
    }
  ).filter(Boolean);

  fs.writeFileSync(
    `./static/content/${lang}/home.json`,
    JSON.stringify(homeJSON, null, 2)
  );
});
