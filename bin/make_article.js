/* eslint-disable no-unused-vars */
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
// const currentLanguage = "hi";
// const currentLanguage = "ta";
const otherLanguage = [undefined, undefined];

if (currentLanguage === "en") {
  otherLanguage[0] = "hi";
  otherLanguage[1] = "ta";
} else if (currentLanguage === "hi") {
  otherLanguage[0] = "en";
  otherLanguage[1] = "ta";
} else if (currentLanguage === "ta") {
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

let article;

records.forEach(async record => {
  article = {
    id: record["Article Link ID"],
    title: record["Name of personality"]
  };
  let enSluggedTitle;

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

  if (currentLanguage === "en") {
    enSluggedTitle = getSluggedTitle();
  } else {
    enSluggedTitle = getSluggedTitle(getCurrentID()["title"]["en"]);
  }

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
    if (currentLanguage === "en") {
      // const image = await fetch(imageURL);
      // if (!fs.existsSync(imageDirectory)) {
      //   fs.mkdir(imageDirectory, err => {
      //     if (err) throw err;
      //   });
      // }
      // const imageFile = fs.createWriteStream(imagePath);
      // image.body.pipe(imageFile);
    }
    return imagePath.substring(1);
  };

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
    wikipediaURL: record["Wikipedia article link"],
    coverImage: {
      url: await getImagePathForArticle(record["Header image"]),
      altText: `Image of ${getImageName(record["Header image"])}`
    },
    summary: record["Short description of personality"],
    translations: [
      {
        url: `/read/${otherLanguage[0]}/${enSluggedTitle}`,
        title: getCurrentID()["title"][otherLanguage[0]],
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
              // articleID
              url: record["Place Link ID"]
            }
          },
          { label: "Height", value: { label: record["Height"], url: "" } },
          {
            label: "Other Names",
            value: { label: record["Nicknames/Other names"], url: "" }
          },
          { label: "Age", value: record["Age"] },
          {
            label: "Nationality",
            value: {
              label: record["Nationality"],
              // articleID
              url: record["Country Link ID"]
            }
          },
          {
            label: "Role",
            value: {
              label: record["Fielding position/Role"],
              // articleID
              url: record["Role Link ID"]
            }
          }
        ]
      },
      {
        // Is often null
        title: "Family",
        cardType: "avatar",
        label: "",
        facts: [
          {
            label: record["Relationship with personality 1"],
            value: {
              label: record["Relation 1"],
              // articleID
              url: record["Relation 1 card  ID "],
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
            label: record["Phase 1 Title"],
            id: 0,
            note: record["Phase 1 - First Class Debut Year"],
            value: {
              label: record["Phase 1 - Single line description"],
              // cardID record["Phase 1 card-  ID"]
              facts: [
                {
                  label: record["Phase 1 card-  ID"],
                  value: {
                    label: record["Phase 1 card-  ID"],
                    image: {
                      url: record["Phase 1 card-  ID"],
                      altText: record["Phase 1 card-  ID"]
                    }
                  }
                }
              ]
            }
          },
          {
            label: record["Phase 2 Title"],
            id: 3,
            note:
              record["Phase 2 - National team debut year in cricket form 1"],
            value: {
              label: record["Phase 2 - Single line description"],
              //  cardID record["Phase 2 card-  ID"]
              facts: [
                {
                  label: record["Phase 2 card-  ID"],
                  value: {
                    label: record["Phase 2 card-  ID"],
                    image: {
                      url: record["Phase 2 card-  ID"],
                      altText: record["Phase 2 card-  ID"]
                    }
                  }
                }
              ]
            }
          },
          {
            label: record["Phase 3 Title"],
            id: 1,
            note: record["Phase 3 -Year of the tournament"],
            value: {
              label: record["Phase 3 - Single line description"],
              // cardID record["Phase 3 card-  ID"]
              facts: [
                {
                  label: record["Phase 2 card-  ID"],
                  value: {
                    label: record["Phase 2 card-  ID"],
                    image: {
                      url: record["Phase 2 card-  ID"],
                      altText: record["Phase 2 card-  ID"]
                    }
                  }
                }
              ]
            }
          },
          {
            label: record["Phase 4 Title"],
            id: 1,
            note: record["Phase 4 -Year of the tournament"],
            value: {
              label: record["Phase 4 - Single line description"],
              // cardID  record["Phase 4 card-  ID"]
              facts: [
                {
                  label: record["Phase 2 card-  ID"],
                  value: {
                    label: record["Phase 2 card-  ID"],
                    image: {
                      url: record["Phase 2 card-  ID"],
                      altText: record["Phase 2 card-  ID"]
                    }
                  }
                }
              ]
            }
          },
          {
            label: record["Phase 5 Title"],
            id: 1,
            note: record["Phase 5 -Year of the tournament"],
            value: {
              label: record["Phase 5 - Single line description"],
              // cardID record["Phase 5 card-  ID"]
              facts: [
                {
                  label: record["Phase 2 card-  ID"],
                  value: {
                    label: record["Phase 2 card-  ID"],
                    image: {
                      url: record["Phase 2 card-  ID"],
                      altText: record["Phase 2 card-  ID"]
                    }
                  }
                }
              ]
            }
          },
          {
            label: record["Phase 6 Title"],
            id: 1,
            note: record["Phase 6 -Year of the trophy"],
            value: {
              label: record["Phase 6 - Single line description"],
              // cardID record["Phase 6 card-  ID"]
              facts: [
                {
                  label: record["Phase 2 card-  ID"],
                  value: {
                    label: record["Phase 2 card-  ID"],
                    image: {
                      url: record["Phase 2 card-  ID"],
                      altText: record["Phase 2 card-  ID"]
                    }
                  }
                }
              ]
            }
          },
          {
            label: record["Phase 7 Title"],
            id: 1,
            note: record["Phase 7  -IPL debut year"],
            value: {
              label: record["Phase 7 - Single line description"],
              // cardID record["Phase 7 card-  ID"]
              facts: [
                {
                  label: record["Phase 2 card-  ID"],
                  value: {
                    label: record["Phase 2 card-  ID"],
                    image: {
                      url: record["Phase 2 card-  ID"],
                      altText: record["Phase 2 card-  ID"]
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
              facts: [
                {
                  label: record["National Team represented"],
                  // cardID BUT all the info is in the sheet anyway so I guess articleID?
                  url: record["Card - National team-  ID"],
                  value: {
                    label: record["Short description of the National Team"],
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
              ]
            }
          },
          {
            label:
              record["Years played in current / last represented IPL team"],
            value: {
              facts: [
                {
                  label:
                    record[
                      "IPL Team represented - Current team or Team last represented"
                    ],
                  url:
                    // articleID
                    record["Card - IPL Team - ID"],
                  value: {
                    label: record["Short description of the IPL team"],
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
              ]
            }
          },
          {
            label: record["Years played in Domestic Team"],
            value: {
              facts: [
                {
                  label: record["Domestic team Represented"],
                  // No article ID, what do?
                  url:
                    record[
                      "Link to the Wikipedia article of the Domestic team"
                    ],
                  value: {
                    label: record["Short description of Domestic Team"],
                    // TODO: Image not present in parser
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
              ]
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
                url: await getImagePathForArticle(
                  record["Achievement Image 1"]
                ),
                altText: `Image of ${getImageName(
                  record["Achievement Image 1"]
                )}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 2"],
              image: {
                url: await getImagePathForArticle(
                  record["Achievement Image 2"]
                ),
                altText: `Image of ${getImageName(
                  record["Achievement Image 2"]
                )}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 3"],
              image: {
                url: await getImagePathForArticle(
                  record["Achievement Image 3"]
                ),
                altText: `Image of ${getImageName(
                  record["Achievement Image 3"]
                )}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 4"],
              image: {
                url: await getImagePathForArticle(
                  record["Achievement Image 4"]
                ),
                altText: `Image of ${getImageName(
                  record["Achievement Image 4"]
                )}`
              }
            }
          },
          {
            label: null,
            value: {
              label: record["Achievement or Record 5"],
              image: {
                url: await getImagePathForArticle(
                  record["Achievement Image 5"]
                ),
                altText: `Image of ${getImageName(
                  record["Achievement Image 5"]
                )}`
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

// TODO: refactor components to not dispolay things if value is empty string.

// TODO: write a function which takes every url, and enters it only if the
// link of the url exisst in our experience

// TODO: if should not be empty, error state, but if can be empty, don't generate the fact at all.
