const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const { parse: parseDate, format } = require("date-fns");
const shortid = require("shortid");

const idMap = require("../static/content/article_ids.json");
const {
  findIdMapEntryById,
  getSluggedTitle,
  makeContentUrl,
  makeArticleUrl,
  getCardInfoFromId
} = require("./lib");

const csvExports = {
  en: { path: "./csv/personalities.en.csv" },
  hi: { path: "./csv/personalities.hi.csv" },
  ta: { path: "./csv/personalities.ta.csv" }
};

const ID_KEY = "Article Link ID";
const TITLE_KEY = "Name of personality";
const WIKIPEDIA_URL_KEY = "Wikipedia article link";
const COVER_IMAGE_KEY = "Header image";
const SUMMARY_KEY = "Short description of personality";
const FULL_NAME_KEY = "Birth Name";
const BORN_ON_KEY = "Born on";
const AGE_KEY = "Age";
const BIRTHPLACE_KEY = "Birthplace";
const BIRTHPLACE_URL_KEY = "Wikipedia article link of the Birth place";
const BIRTHPLACE_ID_KEY = "Place Link ID";
const HEIGHT_KEY = "Height";
const OTHER_NAMES_KEY = "Nicknames/Other names";
const NATIONALITY_KEY = "Nationality";
const ROLE_KEY = "Fielding position/Role";
const RELATION_1_KEY = "Relation 1";
const RELATION_1_ID_KEY = "Relation 1 card  ID ";
const RELATION_1_RELATIONSHIP_KEY = "Relationship with personality 1";
const RELATION_1_IMAGE_KEY = "Link to the image of relation 1";
const ALMA_MATER_KEY = "Name of school";
const ALMA_MATER_DESCRIPTION_KEY =
  "Short notable description on area of study/events during personalities time in school";
const ALMA_MATER_IMAGE_KEY = "Link to image of school";
const STYLE_OF_PLAY_KEY = "Style of play";
const STYLE_OF_PLAY_IMAGE_KEY = "Relevant image link";

const PHASES = [
  {
    KEY: "Phase 1 Title",
    CARD_ID_KEY: "Phase 1 card-  ID",
    YEAR_KEY: "Phase 1 - First Class Debut Year",
    DESCRIPTION_KEY: "Phase 1 - Single line description",
    CARD_LABEL_KEY: "Phase 1 - Name of the debut trophy"
  },
  {
    KEY: "Phase 2 Title",
    CARD_ID_KEY: "Phase 2 card-  ID",
    YEAR_KEY: "Phase 2 - National team debut year in cricket form 1",
    DESCRIPTION_KEY: "Phase 2 - Single line description",
    CARD_LABEL_KEY: "Phase 2 - Opposition team"
  },
  {
    KEY: "Phase 3 Title",
    CARD_ID_KEY: "Phase 3 card-  ID",
    YEAR_KEY: "Phase 3 -Year of the tournament",
    DESCRIPTION_KEY: "Phase 3 - Single line description",
    CARD_LABEL_KEY: "Phase 3 - Name of the ICC tournament"
  },
  {
    KEY: "Phase 4 Title",
    CARD_ID_KEY: "Phase 4 card-  ID",
    YEAR_KEY: "Phase 4 -Year of the tournament",
    DESCRIPTION_KEY: "Phase 4 - Single line description",
    CARD_LABEL_KEY: "Phase 4 - Name of the ICC tournament"
  },
  {
    KEY: "Phase 5 Title",
    CARD_ID_KEY: "Phase 5 card-  ID",
    YEAR_KEY: "Phase 5 -Year of the trophy",
    DESCRIPTION_KEY: "Phase 5 - Single line description",
    CARD_LABEL_KEY: "Phase 5 - Name of the ICC trophy"
  },
  {
    KEY: "Phase 6 Title",
    CARD_ID_KEY: "Phase 6 card-  ID",
    YEAR_KEY: "Phase 6 -Year of the trophy",
    DESCRIPTION_KEY: "Phase 6 - Single line description",
    CARD_LABEL_KEY: "Phase 6 - Name of the ICC trophy"
  },
  {
    KEY: "Phase 7 Title",
    CARD_ID_KEY: "Phase 7 card-  ID",
    YEAR_KEY: "Phase 7  -IPL debut year",
    DESCRIPTION_KEY: "Phase 7 - Single line description",
    CARD_LABEL_KEY: "Phase 7  -IPL debut team"
  }
];

const ACHIEVEMENTS_AND_RECORDS = [
  {
    DESCRIPTION_KEY: "Achievement or Record 1",
    IMAGE_KEY: "Achievement Image 1"
  },
  {
    DESCRIPTION_KEY: "Achievement or Record 2",
    IMAGE_KEY: "Achievement Image 2"
  },
  {
    DESCRIPTION_KEY: "Achievement or Record 3",
    IMAGE_KEY: "Achievement Image 3"
  },
  {
    DESCRIPTION_KEY: "Achievement or Record 4",
    IMAGE_KEY: "Achievement Image 4"
  },
  {
    DESCRIPTION_KEY: "Achievement or Record 5",
    IMAGE_KEY: "Achievement Image 5"
  }
];

const TEAMS = [
  {
    LABEL_KEY: "National Team represented",
    CARD_ID_KEY: "Card - National team-  ID",
    YEAR_KEY: "Years played in National team",
    DESCRIPTION_KEY: "Short description of the National Team"
  },
  {
    LABEL_KEY: "IPL Team represented - Current team or Team last represented",
    CARD_ID_KEY: "Card - IPL Team - ID",
    YEAR_KEY: "Years played in current / last represented IPL team",
    DESCRIPTION_KEY: "Short description of the IPL team"
  },
  {
    LABEL_KEY: "Domestic team Represented",
    CARD_ID_KEY: "N/A",
    YEAR_KEY: "Years played in Domestic Team",
    DESCRIPTION_KEY: "Short description of Domestic Team"
  }
];

const AWARDS_AND_HONORS = [
  {
    YEAR_KEY: "Year of the award 1",
    LABEL_KEY: "Name of the award 1",
    DESCRIPTION_KEY: "Short Description of the award 1",
    IMAGE_KEY: "Image link for the award 1"
  },
  {
    YEAR_KEY: "Year of the award 2",
    LABEL_KEY: "Name of the award 2",
    DESCRIPTION_KEY: "Short Description of the award 2",
    IMAGE_KEY: "Image link for the award 2"
  },
  {
    YEAR_KEY: "Year of the award 3",
    LABEL_KEY: "Name of the award 3",
    DESCRIPTION_KEY: "Short Description of the award 3",
    IMAGE_KEY: "Image link for the award 3"
  },
  {
    YEAR_KEY: "Year of the award 4",
    LABEL_KEY: "Name of the award 4",
    DESCRIPTION_KEY: "Short Description of the award 4",
    IMAGE_KEY: "Image link for the award 4"
  },
  {
    YEAR_KEY: "Year of the award 5",
    LABEL_KEY: "Name of the award 5",
    DESCRIPTION_KEY: "Short Description of the award 5",
    IMAGE_KEY: "Image link for the award 5"
  }
];

module.exports.exportPersonalities = () => {
  Object.keys(csvExports).forEach(lang => {
    const fileContent = fs.readFileSync(csvExports[lang].path, "utf8");
    const records = parse(fileContent, { columns: true, delimiter: "," });

    records.forEach(record => {
      const personality = {};
      const idTitleMap = findIdMapEntryById(idMap, record[ID_KEY]);
      const englishSlug = getSluggedTitle(idTitleMap.title.en);

      personality.title = record[TITLE_KEY];
      if (!personality.title) {
        return;
      }

      personality.wikipediaUrl = record[WIKIPEDIA_URL_KEY];

      // TODO: change file URL to our static directory.
      personality.coverImage = {
        url: record[COVER_IMAGE_KEY],
        altText: `Image of ${personality.title}`
      };

      personality.summary = record[SUMMARY_KEY];

      const translationLanguages = Object.keys(csvExports).filter(
        l => l !== lang
      );

      personality.translations = translationLanguages.map(tl => ({
        lang: tl,
        title: idTitleMap.title[tl],
        url: `/read/${tl}/${englishSlug}`
      }));

      personality.sections = [];

      const birthplaceSection = {
        label: "Birthplace",
        value: {
          label: record[BIRTHPLACE_KEY],
          url: record[BIRTHPLACE_URL_KEY]
        }
      };

      const birthplaceArticleEntry = findIdMapEntryById(
        idMap,
        record[BIRTHPLACE_ID_KEY]
      );

      if (birthplaceArticleEntry) {
        birthplaceSection.value.contentUrl = makeContentUrl(
          lang,
          getSluggedTitle(birthplaceArticleEntry.title.en)
        );
      }

      let otherNamesSection = null;
      if (record[OTHER_NAMES_KEY]) {
        otherNamesSection = {
          label: "Other Names",
          value: {
            label: record[OTHER_NAMES_KEY]
          }
        };
      }

      // About table.
      // TODO: translate the UI strings.
      personality.sections.push({
        title: "About",
        cardType: "table",
        facts: [
          {
            label: "Full Name",
            value: {
              label: record[FULL_NAME_KEY]
            }
          },
          {
            label: "Born On",
            value: {
              label: `${format(
                parseDate(record[BORN_ON_KEY], "dd/MM/yyyy", new Date()),
                "dd MMM yyyy"
              )} (age ${record[AGE_KEY]})`
            }
          },
          birthplaceSection,
          {
            label: "Height",
            value: {
              label: record[HEIGHT_KEY]
            }
          },
          otherNamesSection,
          {
            label: "Nationality",
            value: {
              label: record[NATIONALITY_KEY]
            }
          },
          {
            label: "Role",
            value: {
              label: record[ROLE_KEY]
            }
          }
        ].filter(f => !!f)
      });

      // Relationship table.
      if (record[RELATION_1_KEY]) {
        const relationshipArticleEntry = findIdMapEntryById(
          idMap,
          record[RELATION_1_ID_KEY]
        );

        let relationshipArticleUrl = null;
        let relationshipArticleContentUrl = null;

        if (relationshipArticleEntry) {
          relationshipArticleUrl = makeArticleUrl(
            lang,
            getSluggedTitle(relationshipArticleEntry.title.en)
          );
          relationshipArticleContentUrl = makeContentUrl(
            lang,
            getSluggedTitle(relationshipArticleEntry.title.en)
          );
        }

        personality.sections.push({
          title: "Family",
          cardType: "avatar",
          facts: [
            {
              label: record[RELATION_1_RELATIONSHIP_KEY],
              value: {
                label: record[RELATION_1_KEY],
                url: relationshipArticleUrl,
                contentUrl: relationshipArticleContentUrl,
                image: {
                  url: record[RELATION_1_IMAGE_KEY],
                  altText: `Picture of ${record[RELATION_1_KEY]}`
                }
              }
            }
          ]
        });
      }

      // Alma mater.
      if (record[ALMA_MATER_KEY].trim()) {
        personality.sections.push({
          title: "Alma mater",
          cardType: "avatar",
          facts: [
            {
              label: record[ALMA_MATER_KEY],
              value: {
                label: record[ALMA_MATER_DESCRIPTION_KEY],
                image: {
                  url:
                    record[ALMA_MATER_IMAGE_KEY] ||
                    "/static/images/default_person.svg",
                  altText: `Image of ${record[ALMA_MATER_KEY]}`
                }
              }
            }
          ]
        });
      }

      // Style of play.

      const styleOfPlaySection = {
        title: "Style of play",
        id: shortid.generate(),
        cardType: "simple",
        facts: [
          {
            label: "",
            value: {
              label: record[STYLE_OF_PLAY_KEY]
            }
          }
        ]
      };

      if (record[STYLE_OF_PLAY_IMAGE_KEY].trim()) {
        styleOfPlaySection.facts[0].value.image = {
          url: record[STYLE_OF_PLAY_IMAGE_KEY],
          altText: `Style of play for ${personality.title}`
        };
      }

      personality.sections.push(styleOfPlaySection);

      // Career phase(s).
      const careerPhasesSection = {
        title: "Phase(s)",
        cardType: "vertical_timeline",
        facts: PHASES.map(phase => {
          if (!record[phase.KEY]) {
            return null;
          }

          const phaseFact = {
            label: record[phase.KEY],
            id: shortid.generate(),
            note: record[phase.YEAR_KEY],
            value: {
              label: record[phase.DESCRIPTION_KEY]
            }
          };

          const cardData = getCardInfoFromId(
            idMap,
            record[phase.CARD_ID_KEY],
            lang
          );
          if (cardData) {
            phaseFact.value.facts = [
              {
                url: cardData.url,
                contentUrl: cardData.contentUrl,
                label: cardData.title || record[phase.CARD_LABEL_KEY],
                id: shortid.generate(),
                value: {
                  label: cardData.summary,
                  image: {
                    url: cardData.imageUrl,
                    altText: `Image of ${cardData.title}`
                  }
                }
              }
            ];
          }

          return phaseFact;
        }).filter(f => !!f)
      };

      personality.sections.push(careerPhasesSection);

      // Achievements and records.
      personality.sections.push({
        title: "Achievements & Records",
        cardType: "stories",
        facts: ACHIEVEMENTS_AND_RECORDS.map(ar => ({
          label: "",
          id: getSluggedTitle(ar.DESCRIPTION_KEY.trim()),
          value: {
            label: record[ar.DESCRIPTION_KEY],
            image: {
              url: record[ar.IMAGE_KEY],
              altText: record[ar.DESCRIPTION_KEY]
            }
          }
        }))
      });

      // Teams.
      personality.sections.push({
        title: "Team(s)",
        cardType: "list_card",
        facts: TEAMS.map(team => {
          if (!record[team.LABEL_KEY]) {
            return null;
          }

          const fact = {
            label: `${record[team.LABEL_KEY]} (${record[team.YEAR_KEY]})`,
            id: shortid.generate(),
            value: {
              label: record[team.DESCRIPTION_KEY]
            }
          };

          const card = getCardInfoFromId(idMap, record[team.CARD_ID_KEY], lang);
          if (card) {
            fact.value.label = "";
            fact.value.facts = [
              {
                label: card.title,
                id: shortid.generate(),
                url: card.url,
                contentUrl: card.contentUrl,
                value: {
                  label: card.summary,
                  image: {
                    url: card.imageUrl,
                    altText: `Picture of ${card.title}`
                  }
                }
              }
            ];
          }

          return fact;
        }).filter(f => !!f)
      });

      // Awards and honors.
      personality.sections.push({
        title: "Awards & Honors",
        cardType: "tag_card",
        facts: AWARDS_AND_HONORS.map((award, index) => {
          if (!record[award.LABEL_KEY]) {
            return null;
          }

          return {
            label: record[award.LABEL_KEY],
            tag: record[award.YEAR_KEY],
            id: `award-${index}`,
            value: {
              label: record[award.DESCRIPTION_KEY],
              image: {
                url: record[award.IMAGE_KEY],
                altText: `Image of ${record[award.LABEL_KEY]}`
              }
            }
          };
        }).filter(a => !!a)
      });

      // Outside sports.

      // TODO: remove null facts from all sections.

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(personality, null, 2)
      );
    });
  });
};
