/* eslint-disable dot-notation */
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const slugify = require("slugify");

// path to content from spreadsheet
const path = "./csv/personalities.csv";

// read content
const input = fs.readFileSync(path, "utf8", (err, content) => {
  return content;
});

//  create JS Object
const records = parse(input, {
  columns: true,
  delimiter: ","
});

let article;

records.forEach(record => {
  // Putting together the completed JS object
  article = {
    title: record["Name of personality"],
    coverImage: {
      url: record["Header image"],
      altText: record["Name of personality"] //TODO: change this to image title
    },
    summary: record["Short description of personality"],
    sections: [
      {
        title: "About",
        cardType: "table",
        facts: [
          { label: "Full Name", value: record["Birth Name"] },
          { label: "Born on", value: record["Born on"] }, //TODO: format the dates on this line
          {
            label: "Birthplace",
            value: {
              label: record["Birthplace"],
              url: record["Wikipedia article link of the Birth place"]
            }
          },
          { label: "Height", value: record["Height"] },
          { label: "Other Names", value: record["Nicknames/Other names"] },
          //   { label: "Age", value: record["Age"] },
          //   { label: "Residence", value: record["Residence"] },
          {
            label: "Nationality",
            value: {
              label: record["Nationality"],
              url: record["Wikipedia article link of the Nationality"]
            }
          },
          { label: "Role", value: record["Fielding position/Role"] }
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
                url: record["Link to the image of relation 1"],
                altText: "text goes here" //TODO: Replace
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
                      url: record["Phase 1- Image related to the place"],
                      altText: "Kitten mata ki jai"
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
                      altText: "Kitten mata ki jai"
                    }
                  }
                }
              ]
            }
          }
        ]
      }, 
      
    ]
  };

  const sluggedTitle = slugify(article.title, "_").toLowerCase(); //TODO: remove slugify

  fs.writeFile(`./csv/${sluggedTitle}.json`, JSON.stringify(article), err => {
    if (err) console.log(err);
  });
});

//TODO: refactor components to not dispolay things if value is empty string.

//TODO: optimize the images by downloading them all initially and then running them
//through ImageOptim and then moving them to static.

//TODO: write a function which takes every url, and enters it only if the
//link of the url exisst in our experience
