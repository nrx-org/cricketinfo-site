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
const PHASE_1_KEY = "Phase 1 Title";
const PHASE_1_CARD_ID_KEY = "Phase 1 card-  ID";
const PHASE_1_DEBUT_YEAR_KEY = "Phase 1 - First Class Debut Year";
const PHASE_1_SINGLE_LINE_KEY = "Phase 1 - Single line description";
const PHASE_1_DEBUT_TROPHY_KEY = "Phase 1 - Name of the debut trophy";

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
        facts: []
      };

      let phase1Fact = null;
      if (record[PHASE_1_KEY]) {
        phase1Fact = {
          label: record[PHASE_1_KEY],
          id: shortid.generate(),
          note: record[PHASE_1_DEBUT_YEAR_KEY],
          value: {
            label: record[PHASE_1_SINGLE_LINE_KEY],
            facts: [
              {
                label: record[PHASE_1_DEBUT_TROPHY_KEY],
                id: shortid.generate()
              }
            ]
          }
        };

        const cardData = getCardInfoFromId(
          idMap,
          record[PHASE_1_CARD_ID_KEY],
          lang
        );
        if (cardData) {
          phase1Fact.value.facts[0].url = cardData.url;
          phase1Fact.value.facts[0].contentUrl = cardData.contentUrl;
          phase1Fact.value.facts[0] = {
            ...phase1Fact.value.facts[0],
            label: cardData.title,
            id: shortid.generate(),
            value: {
              label: cardData.summary,
              image: {
                url: cardData.imageUrl,
                altText: `Image of ${cardData.title}`
              }
            }
          };
        }
        careerPhasesSection.facts.push(phase1Fact);
      }

      personality.sections.push(careerPhasesSection);

      // Achievements and records.

      // Teams.

      // Awards and honors.

      // Outside sports.

      // TODO: remove null facts from all sections.

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(personality, null, 2)
      );
    });
  });
};
