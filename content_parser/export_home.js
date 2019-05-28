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
  findIdMapEntryByTitle
} = require("./lib");

const csvExports = {
  en: {
    facts: { path: "./csv/home_facts.en.csv" },
    quiz: { path: "./csv/home_quiz.en.csv" },
    main: { path: "./csv/home_main.en.csv" }
  }
  // hi: {
  //   facts: { path: "./csv/home_facts.hi.csv" },
  //   quiz: { path: "./csv/home_quiz.hi.csv" },
  //   main: { path: "./csv/home_main.hi.csv" }
  // },
  // ta: {
  //   facts: { path: "./csv/home_facts.ta.csv" },
  //   quiz: { path: "./csv/home_quiz.ta.csv" },
  //   main: { path: "./csv/home_main.ta.csv" }
  // },
};

// Home page strategy (home_main.[lang].csv)
const HOME_MAIN_DATE = "Date";
const HOME_MAIN_TIME = "Time";
const HOME_MAIN_VENUE = "Venue";
const HOME_MAIN_TEAM_TO_WATCH_1 = "Team to watch - 1";
const HOME_MAIN_TEAM_TO_WATCH_2 = "Team to watch - 2";
const HOME_MAIN_PLAYER_TO_WATCH_1 = "Player to watch - 1";
const HOME_MAIN_PLAYER_TO_WATCH_2 = "Player to watch - 2";
const HOME_MAIN_PLAYER_TO_WATCH_3 = "Player to watch - 3";
const HOME_MAIN_FACT_OF_THE_DAY_1 = "Fact of the day - 1";
const HOME_MAIN_FACT_OF_THE_DAY_2 = "Fact of the day - 2";
const HOME_MAIN_QUIZ_OF_THE_DAY_1 = "Quiz of the day - 1"; // Modified column name
const HOME_MAIN_QUIZ_OF_THE_DAY_2 = "Quiz of the day - 2"; // Modified column name

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

Object.keys(csvExports).forEach(async lang => {
  let homeJSON = require(`../static/content/${lang}/home.json`);

  const factsFileContent = fs.readFileSync(csvExports[lang].facts.path, "utf8");
  const quizFileContent = fs.readFileSync(csvExports[lang].quiz.path, "utf8");
  const mainFileContent = fs.readFileSync(csvExports[lang].main.path, "utf8");

  let factsRecords = parse(factsFileContent, { columns: true, delimiter: "," });
  const quizRecords = parse(quizFileContent, { columns: true, delimiter: "," });
  const mainRecords = parse(mainFileContent, { columns: true, delimiter: "," });

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
      factsRecords.map(async record => {
        const imagePath = await getImagePathForArticle(
          record[HOME_FACTS_RELEVANT_IMAGE]
        );
        record[HOME_FACTS_RELEVANT_IMAGE] = imagePath;
        return record;
      })
    );
  };

  const getDatesForFactIDFromMainSheet = factId => {
    let dates = [];
    mainRecords.forEach((mainRecord, index) => {
      if (
        [
          mainRecord[HOME_MAIN_FACT_OF_THE_DAY_1],
          mainRecord[HOME_MAIN_FACT_OF_THE_DAY_2]
        ].indexOf(factId) > -1
      ) {
        let recordDateString = mainRecord[HOME_MAIN_DATE];
        if (!recordDateString.length) {
          recordDateString = mainRecords[index - 1][HOME_MAIN_DATE];
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

  factsRecords = await getFactsRecordsWithImagesDownloaded();

  factsRecords = factsRecords.map(factRecord => ({
    label: factRecord[HOME_FACTS_HEADING],
    dates: getDatesForFactIDFromMainSheet(factRecord[HOME_FACTS_FACTID]),
    id: factRecord[HOME_FACTS_FACTID],
    value: {
      url: getUrlFromArticleTitle(factRecord[HOME_FACTS_LINKING_ARTICLE]),
      image: {
        url: factRecord[HOME_FACTS_RELEVANT_IMAGE],
        altText: `Image for ${factRecord[HOME_FACTS_HEADING]}`
      }
    }
  }));

  homeJSON.scheduledFacts = factsRecords.filter(
    factRecord => factRecord.dates.length > 0
  );

  fs.writeFileSync(
    `./static/content/${lang}/home.json`,
    JSON.stringify(homeJSON, null, 2)
  );
});
