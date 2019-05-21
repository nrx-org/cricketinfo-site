/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");
const path = require("path");

// path to content from spreadsheet
const pathToParsedFile = "./csv/personalities.csv";
const currentLanguage = "en";
// const currentLanguage = "hi"
// const currentLanguage = "ta"

const sheetInput = fs.readFileSync(pathToParsedFile, "utf8", (err, content) => {
  return content;
});
const contentUrls = JSON.parse(fs.readFileSync("./bin/content_urls.json"));

//  create JS Object
const records = parse(sheetInput, {
  columns: true,
  delimiter: ","
});

let article;
let enTitle;
let idMap;
let idMapStream;

if (currentLanguage === "en") {
  // for English, create file to map IDs
  idMapStream = fs.createWriteStream("./bin/article_ids.json");
  idMapStream.write('{"IDs": [');
} else {
  // for Hindi/Tamil, append to the existing file
  const idMapInput = fs.readFileSync(
    "./bin/article_ids.json",
    "utf8",
    (err, content) => {
      return content;
    }
  );
  idMap = JSON.parse(idMapInput);
}

records.forEach(async record => {
  article = {
    id: record["Article Link ID"],
    title: record["Name of personality"]
  };

  if (currentLanguage === "en") {
    idMap = {
      id: article["id"],
      title: {
        en: article["title"],
        hi: "",
        ta: ""
      }
    };
    enTitle = article["title"];
    idMapStream.write(JSON.stringify(idMap, null, 2));
    idMapStream.write(",");
  } else {
    idMap.map.forEach(idMapRecord => {
      if (idMapRecord["id"] === article["id"]) {
        // eslint-disable-next-line no-param-reassign
        idMapRecord["title"][currentLanguage] = article["title"];
        enTitle = idMapRecord["title"]["en"];
      }
    });
  }

  // fs.appendFile(JSON.stringify(article.title, null, 2), err => {
  //   if (err) console.log(err);
  // });

  // Get title for URL
  // Since toLowerCase respects locale, and there are no differences in upper and lower case
  // for both Hindi and Tamil, I'm hoping nothing too important breaks by using this.
  const getSluggedTitle = str => {
    if (!str) return article.title.replace(/ /g, "_").toLowerCase();
    return str.replace(/ /g, "_").toLowerCase();
  };
  const enSluggedTitle = getSluggedTitle(enTitle);

  // Get file name from url link
  const getFileNameFromURL = url => {
    if (!url) return null;
    return url.match(/File:(.*)/)[1];
  };

  const getImageName = url => {
    const fileName = getFileNameFromURL(url);
    if (!fileName) return null;
    return path.parse(fileName).name.replace(/[-_]/g, " ");
  };

  // Download all the images and put them in static
  const getImagePathForArticle = async url => {
    if (!url) {
      return "/static/images/default_person.svg";
    }
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const imageURL = $(".fullMedia > p > a").attr("href");
    if (!imageURL) {
      return null;
    }
    const imageName = getFileNameFromURL(url);
    const imageDirectory = `./static/images/${enSluggedTitle}`;
    const imagePath = `${imageDirectory}/${imageName}`;
    if (currentLanguage === "en") {
      const image = await fetch(imageURL);
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

  contentUrls[currentLanguage][
    enSluggedTitle
  ] = `/static/content/${currentLanguage}/${getSluggedTitle()}.json`;

  const addEducation = async () => {
    if (!record["Name of school"]) return;
    const education = {
      title: "Education",
      cardType: "tag_card",
      facts: [
        {
          label: record["Name of school"],
          tag: record["Year of graduation"],
          value: {
            label: record["Caption of image of school"],
            image: {
              url: await getImagePathForArticle(
                record["Link to image of school"]
              ),
              altText: `Image of ${getImageName(
                record["Link to image of school"]
              )}`
            }
          }
        }
      ]
    };
    // eslint-disable-next-line consistent-return
    return education;
  };

  // TODO: create a function which updates the translation URLs section using the id mapper

  // Putting together the completed JS object
  article = {
    ...article,
    coverImage: {
      url: await getImagePathForArticle(record["Header image"]),
      altText: `Image of ${getImageName(record["Header image"])}`
    },
    summary: record["Short description of personality"],
    translations: [
      {
        url: `/hi/${getSluggedTitle()}`, // TODO: make this return hindi text
        title: "महेंद्र सिंह धोनी", // TODO: make this return hindi text
        lang: "hi"
      },
      {
        url: `/ta/${getSluggedTitle()}`, // TODO: make this return tamil text
        title: "விராத் கோலி", // TODO: make this return tamil text
        lang: "pa"
      }
    ],
    sections: [
      {
        title: "About",
        cardType: "table",
        facts: [
          {
            label: "Full Name",
            value: { label: record["Birth Name"], url: "" }
          },
          { label: "Born on", value: { label: record["Born on"], url: "" } }, // TODO: format the dates on this line
          {
            label: "Birthplace",
            value: {
              label: record["Birthplace"],
              url: record["Wikipedia article link of the Birth place"]
            }
          },
          { label: "Height", value: { label: record["Height"], url: "" } },
          {
            label: "Other Names",
            value: { label: record["Nicknames/Other names"], url: "" }
          },
          //   { label: "Age", value: record["Age"] },
          //   { label: "Residence", value: record["Residence"] },
          {
            label: "Nationality",
            value: {
              label: record["Nationality"],
              url: record["Wikipedia article link of the Nationality"]
            }
          },
          {
            label: "Role",
            value: { label: record["Fielding position/Role"], url: "" }
          }
        ]
      },
      {
        title: "Family",
        cardType: "avatar",
        label: "",
        facts: [
          {
            label: record["Relationship with personality"],
            value: {
              label: record["Relation 1"],
              image: {
                url: await getImagePathForArticle(
                  record["Link to the image of relation 1"]
                ),
                altText: `Image of ${getImageName(
                  record["Link to the image of relation 1"]
                )}`
              }
            }
          }
        ]
      },
      {
        title: "Phase(s)",
        cardType: "vertical_timeline",
        facts: [
          {
            label: "Year of Birth",
            id: 0,
            note: null,
            value: {
              label: record["Phase 1 - Single line description"],
              facts: [
                {
                  label: "Place of Birth",
                  id: 0,
                  value: {
                    label: record["Phase 1 - Place of birth"],
                    url: record["Phase 1 - Link to the place of birth "],
                    image: {
                      url: await getImagePathForArticle(
                        record["Phase 1- Image related to the place"]
                      ),
                      altText: `Image of ${getImageName(
                        record["Phase 1- Image related to the place"]
                      )}`
                    }
                  }
                }
              ]
            }
          },
          {
            label: "Debut Year",
            id: 3,
            note: record["Phase 2 - First Class Debut Year"],
            value: {
              label: record["Phase 2 - Single line description"],
              facts: [
                {
                  label: record["Phase 2 - Name of the debut trophy"],
                  id: 0,
                  value: {
                    label: "",
                    url: record["Phase 2 - Link to the Trophy article"],
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
            label: record["National Team Debut"],
            note:
              record["Phase 3 - National team debut year in cricket form 1"],
            id: 1,
            value: {
              label: record["Phase 3 - Opposition team"],
              facts: [
                {
                  label: "",
                  id: 0,
                  value: {
                    label: record["Phase 3 - Single line description"],
                    url:
                      record[
                        "Phase 3 - Link to the opposition team's wikipedia page"
                      ],
                    image: {
                      url: "https://placekitten.com/200/200",
                      altText: `Image of ${getImageName(
                        record["Phase 1- Image related to the place"]
                      )}`
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      {
        title: "Style of Play",
        cardType: "simple",
        facts: [
          {
            value: {
              label: record["Style of play"],
              image: {
                url: await getImagePathForArticle(
                  record["Relevant image link"]
                ),
                altText: `Image of ${getImageName(
                  record["Relevant image link"]
                )}`
              }
            }
          }
        ]
      },
      {
        title: "Teams",
        cardType: "list_card",
        facts: [
          {
            label: record["Years played in National team"],
            value: {
              label: record["National Team represented"],
              value: {
                label: record["Short description of the National Team"],
                url:
                  record["Link to the Wikipedia article of the National team"],
                image: {
                  url: await getImagePathForArticle(
                    record["Link to the National team Logo"]
                  ),
                  altText: `Image of ${getImageName(
                    record["Link to the National team Logo"]
                  )}`
                }
              }
            }
          },
          {
            label:
              record["Years played in current / last represented IPL team"],
            value: {
              label:
                record[
                  "IPL Team represented - Current team or Team last represented"
                ],
              value: {
                label: record["Short description of the IPL team"],
                url:
                  record[
                    "Link to the Wikipedia article of the IPL - Current Team or Team last represented"
                  ],
                image: {
                  url: await getImagePathForArticle(
                    record["Link to the IPL team logo"]
                  ),
                  altText: `Image of ${getImageName(
                    record["Link to the IPL team logo"]
                  )}`
                }
              }
            }
          },
          {
            label: record["Years played in Domestic Team"],
            value: {
              label: record["Domestic team Represented"],
              value: {
                label: record["Short description of Domestic Team"],
                url:
                  record["Link to the Wikipedia article of the Domestic team"],
                image: {
                  url: await getImagePathForArticle(
                    record["Link to the IPL team logo"]
                  ),
                  altText: `Image of ${getImageName(
                    record["Link to the IPL team logo"]
                  )}`
                }
              }
            }
          }
        ]
      },
      {
        title: "Awards & Honors",
        cardType: "tag_card",
        facts: [
          {
            label: record["Name of the award 1"],
            tag: record["Year of the award 1"],
            value: {
              label: record["Short Description of the award 1"],
              image: {
                url: await getImagePathForArticle(
                  record["Image link for the award 1"]
                ),
                altText: `Image of ${getImageName(
                  record["Image link for the award 1"]
                )}`
              }
            }
          },
          {
            label: record["Name of the award 2"],
            tag: record["Year of the award 2"],
            value: {
              label: record["Short Description of the award 2"],
              image: {
                url: await getImagePathForArticle(
                  record["Image link for the award 2"]
                ),
                altText: `Image of ${getImageName(
                  record["Image link for the award 2"]
                )}`
              }
            }
          },
          {
            label: record["Name of the award 3"],
            tag: record["Year of the award 3"],
            value: {
              label: record["Short Description of the award 3"],
              image: {
                url: await getImagePathForArticle(
                  record["Image link for the award 3"]
                ),
                altText: `Image of ${getImageName(
                  record["Image link for the award 3"]
                )}`
              }
            }
          },
          {
            label: record["Name of the award 4"],
            tag: record["Year of the award 4"],
            value: {
              label: record["Short Description of the award 4"],
              image: {
                url: await getImagePathForArticle(
                  record["Image link for the award 4"]
                ),
                altText: `Image of ${getImageName(
                  record["Image link for the award 4"]
                )}`
              }
            }
          }
        ]
      },
      await addEducation(),
      {
        title: "Achievement & Records",
        cardType: "stories",
        facts: [
          {
            label: null,
            value: {
              label: record["Achievement or Record 1"],
              image: {
                url: await getImagePathForArticle(record["Image 1"]),
                altText: `Image of ${getImageName(record["Image 1"])}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 2"],
              image: {
                url: await getImagePathForArticle(record["Image 2"]),
                altText: `Image of ${getImageName(record["Image 2"])}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 3"],
              image: {
                url: await getImagePathForArticle(record["Image 3"]),
                altText: `Image of ${getImageName(record["Image 3"])}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 4"],
              image: {
                url: await getImagePathForArticle(record["Image 4"]),
                altText: `Image of ${getImageName(record["Image 4"])}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 5"],
              image: {
                url: await getImagePathForArticle(record["Image 5"]),
                altText: `Image of ${getImageName(record["Image 5"])}`
              }
            }
          }
        ]
      }
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

fs.writeFileSync("./bin/content_urls.json", "");
fs.writeFileSync(
  "./bin/content_urls.json",
  JSON.stringify(contentUrls, null, 2)
);

if (currentLanguage === "en") {
  // For English, finish the ID map file
  idMapStream.write("]}");
} else {
  // For Hindi/Tamil, rewrite the entire file

  fs.writeFileSync("./bin/article_ids.json", "");
  fs.writeFileSync("./bin/article_ids.json", idMap);
}

// TODO: refactor components to not dispolay things if value is empty string.

// TODO: write a function which takes every url, and enters it only if the
// link of the url exisst in our experience

// TODO: if should not be empty, error state, but if can be empty, don't generate the fact at all.
