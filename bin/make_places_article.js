/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");
const path = require("path");

// path to content from spreadsheet
const pathToParsedFile = "./csv/places.csv";
const currentLanguage = "en";
// const currentLanguage = "hi";
// const currentLanguage = "ta";
const otherLanguage = [undefined, undefined];
let uiID;

if (currentLanguage === "en") {
  uiID = 0;
  otherLanguage[0] = "hi";
  otherLanguage[1] = "ta";
} else if (currentLanguage === "hi") {
  uiID = 1;
  otherLanguage[0] = "en";
  otherLanguage[1] = "ta";
} else if (currentLanguage === "ta") {
  uiID = 2;
  otherLanguage[0] = "hi";
  otherLanguage[1] = "en";
} else {
  // TODO: Write a better exit
}

const sheetInput = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});
const records = parse(sheetInput, { columns: true, delimiter: "," });
const idMap = JSON.parse(fs.readFileSync("./bin/article_ids.json", "utf8"));
const uiInput = fs.readFileSync("./csv/ui.csv", "utf8");
const ui = parse(uiInput, {
  columns: [
    "l",
    "About",
    "Total Area",
    "Population",
    "Other names",
    "Capital",
    "Largest City",
    "Timezone(s)",
    "History",
    "Government",
    "Prime Minister",
    "President",
    "Chief Justice",
    "Team",
    "Player",
    "In Sports",
    "Geography",
    "Culture",
    "Demographics",
    "Languages",
    "Religions"
  ],
  delimiter: ","
});

let article;
let enSluggedTitle;

records.forEach(async record => {
  article = {
    id: record["Article Link ID"],
    title: record["Name of the place"]
  };

  // Get title for URL
  // Since toLowerCase respects locale, and there are no differences in upper and lower case
  // for both Hindi and Tamil, I'm hoping nothing too important breaks by using this.
  const getSluggedTitle = str => {
    if (!str) return article.title.replace(/ /g, "_").toLowerCase();
    return str.replace(/ /g, "_").toLowerCase();
  };

  const getCurrentID = () =>
    idMap.find(idMapRecord =>
      idMapRecord["id"] === article["id"] ? idMapRecord : null
    );

  enSluggedTitle = getSluggedTitle(getCurrentID()["title"]["en"]);

  // Get file name from url link
  const getFileNameFromURL = url => {
    if (!url) return null;
    const filename = url.match(/File:(.*)/);
    if (filename) return filename[1];
    return null;
  };

  const getImageName = url => {
    const fileName = getFileNameFromURL(url);
    if (!fileName) return null;
    return path.parse(fileName).name.replace(/[-_]/g, " ");
  };

  // Download all the images and put them in static
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
    const imageDirectory = `./static/images/${enSluggedTitle}`;
    const imagePath = `${imageDirectory}/${imageName}`;
    // if (currentLanguage === "en") {
    //   const image = await fetch(url);
    //   // const image = await fetch(imageURL);
    //   if (!fs.existsSync(imageDirectory)) {
    //     fs.mkdir(imageDirectory, err => {
    //       if (err) throw err;
    //     });
    //   }
    //   const imageFile = fs.createWriteStream(imagePath);
    //   image.body.pipe(imageFile);
    // }
    return imagePath.substring(1);
  };

  article = {
    ...article,
    wikipediaURL: record["Wikipedia Link to Place"],
    summary: record["Short summary description of the place"],
    coverImage: {
      url: await getImagePathForArticle(record["Header image"]),
      altText: `Image of ${getImageName(record["Header image"])}`
    },
    translations: [
      {
        title: getCurrentID()["title"][otherLanguage[0]],
        url: `/read/${otherLanguage[0]}/${enSluggedTitle}`,
        lang: otherLanguage[0]
      },
      {
        url: `/read/${otherLanguage[1]}/${enSluggedTitle}`,
        title: getCurrentID()["title"][otherLanguage[1]],
        lang: otherLanguage[1]
      }
    ],
    sections: [
      {
        title: ui[uiID]["About"],
        cardType: "table",
        facts: [
          {
            label: record["Important day 1"],
            value: { label: record["Important day 1 date"], url: "" }
          },
          {
            label: record["Important day 2"],
            value: { label: record["Important day 2 date"], url: "" }
          },
          {
            label: record["Important day 3"],
            value: { label: record["Important day 3 date"], url: "" }
          },
          {
            label: ui[uiID]["Total Area"],
            value: {
              label: record["Total Area of country (km squared)"],
              url: ""
            }
          },
          {
            label: ui[uiID]["Population"],
            value: { label: record["Population"], url: "" }
          },
          {
            label: ui[uiID]["Other names"],
            value: { label: record["Other names"], url: "" }
          },
          {
            label: ui[uiID]["Capital"],
            value: { label: record["Capital city"], url: "" }
          },
          {
            label: ui[uiID]["Largest city"],
            value: { label: record["Largest city"], url: "" }
          },
          {
            label: ui[uiID]["Timezone(s)"],
            value: { label: record["Timezone"], url: "" }
          }
        ]
      },
      {
        title: ui[uiID]["History"],
        cardType: "vertical_timeline",
        facts: [
          {
            label: record["History Phase 1 Title"],
            id: 0,
            note: record["History Phase 1 Time period"],
            value: {
              label: record["History Phase 1 Small description"]
            }
          },
          {
            label: record["History Phase 2 Title"],
            id: 1,
            note: record["History Phase 2 Time period"],
            value: {
              label: record["History Phase 2  Small description"]
            }
          },
          {
            label: record["History Phase 3 Title"],
            id: 1,
            note: record["History Phase 3 Time period"],
            value: {
              label: record["History Phase 3  Small description"]
            }
          },
          {
            label: record["History Phase 4 Title"],
            id: 1,
            note: record["History Phase 4 Time period"],
            value: {
              label: record["History Phase 4  Small description"]
            }
          }
        ]
      },
      {
        title: ui[uiID]["Government "],
        cardType: "avatar",
        label: record["Government"],
        facts: [
          {
            label: ui[uiID]["Prime Minister "],
            value: {
              label: record["Prime minister name"],
              url: "",
              image: {
                url: await getImagePathForArticle(
                  record["Prime minister image link"]
                ),
                altText: `Image of ${getImageName(
                  record["Prime minister image link"]
                )}`
              }
            }
          },
          {
            label: ui[uiID]["President "],
            value: {
              label: record["President"],
              url: "",
              image: {
                url: await getImagePathForArticle(
                  record["President image link"]
                ),
                altText: `Image of ${getImageName(
                  record["President image link"]
                )}`
              }
            }
          },
          {
            label: ui[uiID]["Chief Justice "],
            value: {
              label: record["Chief Justice name"],
              url: "",
              image: {
                url: await getImagePathForArticle(
                  record["Chief Justice image link"]
                ),
                altText: `Image of ${getImageName(
                  record["Chief Justice image link"]
                )}`
              }
            }
          }
        ]
      }
      //   Add In Sports, but it's all Cards so figure out how to add that first.
      // record["Team ID Code"] record["Player 1 ID Code"] record["Player 2 ID Code"]
      // Need to display these three players in avatar style
      // {
      //     title: ui[uiID]["Geography"],
      //     cardType: "simple",
      //     facts: [
      //         {
      //             value: {
      //                 label: article["title"],

      //             }
      //         }
      //     ]
      // } // Get back to this after a heading can be taken
      // {
      //     title: ui[uiID]["Culture"],
      //     cardType: "stories",
      //     facts: [
      //         {
      //             label: record["Culture Card 1 Title"]
      //         }
      //     ]
      // } // Get back to this after Chandra can fix the column images header issues
    ]
  };

  fs.writeFile(
    `./static/content/${currentLanguage}/${enSluggedTitle}.json`,
    JSON.stringify(article, null, 2),
    err => {
      if (err) console.log(err);
    }
  );
});
