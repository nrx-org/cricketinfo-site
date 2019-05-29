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
  getCardInfoFromId,
  downloadImageAndFillAttributions
} = require("./lib");

const csvExports = {
  en: { path: "./csv/teams.en.csv" },
  hi: { path: "./csv/teams.hi.csv" },
  ta: { path: "./csv/teams.ta.csv" }
};

const ID_KEY = "Article Code";
const TITLE_KEY = "Name of Team";
const WIKIPEDIA_URL_KEY = "Wikipedia Link";
const COVER_IMAGE_KEY = "Header Image Link";
const SUMMARY_KEY = "Short Summary of Team";

const LOCATION_KEY = "Location";
const LOCATION_ARTICLE_CODE_KEY = "Location article code";
const ESTABLISHED_ON_KEY = "Established On";
const ASSOCIATION_KEY = "Association";

const ROLES = [
  {
    KEY: "Test Captain name",
    IMAGE_KEY: "Test Captain image link",
    ARTICLE_CODE_KEY: "Test Captain article code"
  },
  {
    KEY: "ODI Captain name",
    IMAGE_KEY: "ODI Captain image link",
    ARTICLE_CODE_KEY: "ODI Captain article code"
  },
  {
    KEY: "T20I Captain name",
    IMAGE_KEY: "T20I Captain image link",
    ARTICLE_CODE_KEY: "T20I Captain article code"
  },
  {
    KEY: "Coach name",
    IMAGE_KEY: "Coach image link",
    ARTICLE_CODE_KEY: "Coach article code"
  }
];

const VENUE_NAME_KEY = "Venue Name";
const VENUE_DESCRIPTION_KEY = "Venue Description";
const VENUE_IMAGE_LINK_KEY = "Venue Image Link";

const HISTORY = [
  {
    PHASE_TITLE_KEY: "History Phase 1 Title",
    PHASE_DATES_KEY: "History Phase 1 Dates",
    PHASE_BRIEF_DESCRIPTION_KEY: "History Phase 1 brief description",
    CARDS: [
      {
        CARD_TITLE_KEY: "History Phase 1 Card 1 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 1 Card 1 brief description",
        CARD_ARTICLE_CODE: "History Phase 1 Card 1 article code",
        CARD_IMAGE_URL: "History Phase 1 Card 1 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 1 Card 2 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 1 Card 2 brief description",
        CARD_ARTICLE_CODE: "History Phase 1 Card 2 article code",
        CARD_IMAGE_URL: "History Phase 1 Card 2 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 1 Card 3 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 1 Card 3 brief description",
        CARD_ARTICLE_CODE: "History Phase 1 Card 3 article code",
        CARD_IMAGE_URL: "History Phase 1 Card 3 URL"
      }
    ]
  },
  {
    PHASE_TITLE_KEY: "History Phase 2 Title",
    PHASE_DATES_KEY: "History Phase 2 Dates",
    PHASE_BRIEF_DESCRIPTION_KEY: "History Phase 2 brief description",
    CARDS: [
      {
        CARD_TITLE_KEY: "History Phase 2 Card 1 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 2 Card 1 brief description",
        CARD_ARTICLE_CODE: "History Phase 2 Card 1 article code",
        CARD_IMAGE_URL: "History Phase 2 Card 1 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 2 Card 2 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 2 Card 2 brief description",
        CARD_ARTICLE_CODE: "History Phase 2 Card 2 article code",
        CARD_IMAGE_URL: "History Phase 2 Card 2 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 2 Card 3 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 2 Card 3 brief description",
        CARD_ARTICLE_CODE: "History Phase 2 Card 3 article code",
        CARD_IMAGE_URL: "History Phase 2 Card 3 URL"
      }
    ]
  },
  {
    PHASE_TITLE_KEY: "History Phase 3 Title",
    PHASE_DATES_KEY: "History Phase 3 Dates",
    PHASE_BRIEF_DESCRIPTION_KEY: "History Phase 3 brief description",
    CARDS: [
      {
        CARD_TITLE_KEY: "History Phase 3 Card 1 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 3 Card 1 brief description",
        CARD_ARTICLE_CODE: "History Phase 3 Card 1 article code",
        CARD_IMAGE_URL: "History Phase 3 Card 1 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 3 Card 2 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 3 Card 2 brief description",
        CARD_ARTICLE_CODE: "History Phase 3 Card 2 article code",
        CARD_IMAGE_URL: "History Phase 3 Card 2 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 3 Card 3 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 3 Card 3 brief description",
        CARD_ARTICLE_CODE: "History Phase 3 Card 3 article code",
        CARD_IMAGE_URL: "History Phase 3 Card 3 URL"
      }
    ]
  },
  {
    PHASE_TITLE_KEY: "History Phase 4 Title",
    PHASE_DATES_KEY: "History Phase 4 Dates",
    PHASE_BRIEF_DESCRIPTION_KEY: "History Phase 4 brief description",
    CARDS: [
      {
        CARD_TITLE_KEY: "History Phase 4 Card 1 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 4 Card 1 brief description",
        CARD_ARTICLE_CODE: "History Phase 4 Card 1 article code",
        CARD_IMAGE_URL: "History Phase 4 Card 1 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 4 Card 2 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 4 Card 2 brief description",
        CARD_ARTICLE_CODE: "History Phase 4 Card 2 article code",
        CARD_IMAGE_URL: "History Phase 4 Card 2 URL"
      },
      {
        CARD_TITLE_KEY: "History Phase 4 Card 3 Title",
        CARD_BRIEF_DESCRIPTION_KEY: "History Phase 4 Card 3 brief description",
        CARD_ARTICLE_CODE: "History Phase 4 Card 3 article code",
        CARD_IMAGE_URL: "History Phase 4 Card 3 URL"
      }
    ]
  }
];

const PLAYERS = [
  {
    PLAYER_NAME_KEY: "Player 1 Name",
    PLAYER_DESCRIPTION_KEY: "Player 1 Description",
    PLAYER_IMAGE_URL_KEY: "Player 1 Image URL"
  },
  {
    PLAYER_NAME_KEY: "Player 2 Name",
    PLAYER_DESCRIPTION_KEY: "Player 2 Description",
    PLAYER_IMAGE_URL_KEY: "Player 2 Image URL"
  },
  {
    PLAYER_NAME_KEY: "Player 3 Name",
    PLAYER_DESCRIPTION_KEY: "Player 3 Description",
    PLAYER_IMAGE_URL_KEY: "Player 3 Image URL"
  },
  {
    PLAYER_NAME_KEY: "Player 4 Name",
    PLAYER_DESCRIPTION_KEY: "Player 4 Description",
    PLAYER_IMAGE_URL_KEY: "Player 4 Image URL"
  }
];

const ACHIEVEMENTS = [
  {
    ACHIEVEMENT_TITLE: "Achievement 1 Title",
    ACHIEVEMENT_DESCRIPTION: "Achievement 1 Description",
    ACHIEVEMENT_CARD_TITLE: "Achievement 1 Card Title",
    ACHIEVEMENT_CARD_CODE: "Achievement 1 Card Code",
    ACHIEVEMENT_CARD_URL: "Achievement 1 Card URL"
  },
  {
    ACHIEVEMENT_TITLE: "Achievement 2 Title",
    ACHIEVEMENT_DESCRIPTION: "Achievement 2 Description",
    ACHIEVEMENT_CARD_TITLE: "Achievement 2 Card Title",
    ACHIEVEMENT_CARD_CODE: "Achievement 2 Card Code",
    ACHIEVEMENT_CARD_URL: "Achievement 2 Card URL"
  },
  {
    ACHIEVEMENT_TITLE: "Achievement 3 Title",
    ACHIEVEMENT_DESCRIPTION: "Achievement 3 Description",
    ACHIEVEMENT_CARD_TITLE: "Achievement 3 Card Title",
    ACHIEVEMENT_CARD_CODE: "Achievement 3 Card Code",
    ACHIEVEMENT_CARD_URL: "Achievement 3 Card URL"
  },
  {
    ACHIEVEMENT_TITLE: "Achievement 4 Title",
    ACHIEVEMENT_DESCRIPTION: "Achievement 4 Description",
    ACHIEVEMENT_CARD_TITLE: "Achievement 4 Card Title",
    ACHIEVEMENT_CARD_CODE: "Achievement 4 Card Code",
    ACHIEVEMENT_CARD_URL: "Achievement 4 Card URL"
  }
];

const SPONSORS = [
  {
    SPONSOR_TYPE: "Sponsor Type 1",
    SPOSNOR_NAME: "Sponsor  Type 1 name",
    SPONSOR_IMAGE_URL: "Sponsor Type 1 Image URL"
  },
  {
    SPONSOR_TYPE: "Sponsor Type 2",
    SPOSNOR_NAME: "Sponsor Type 2 Name",
    SPONSOR_IMAGE_URL: "Sponsor Type 2 Image URL"
  },
  {
    SPONSOR_TYPE: "Sponsor Type 3",
    SPOSNOR_NAME: "Sponsor Type 3 Name",
    SPONSOR_IMAGE_URL: "Sponsor Type 3 Image URL"
  },
  {
    SPONSOR_TYPE: "Sponsor Type 4",
    SPOSNOR_NAME: "Sponsor Type 4 Name",
    SPONSOR_IMAGE_URL: "Sponsor Type 4 Image URL"
  }
];

// TODO: instead of auto-generating IDs, generate them from labels, slugs, indexes, etc.

// module.exports.exportTeams = () => {
Object.keys(csvExports).forEach(lang => {
  const fileContent = fs.readFileSync(csvExports[lang].path, "utf8");
  const records = parse(fileContent, { columns: true, delimiter: "," });

  records.forEach(async record => {
    const team = {};
    const idTitleMap = findIdMapEntryById(idMap, record[ID_KEY]);
    const englishSlug = getSluggedTitle(idTitleMap.title.en);

    team.title = record[TITLE_KEY];
    if (!team.title) {
      return;
    }

    team.wikipediaUrl = record[WIKIPEDIA_URL_KEY];

    team.coverImage = await downloadImageAndFillAttributions(
      {
        url: record[COVER_IMAGE_KEY],
        altText: `Image of ${team.title}`
      },
      englishSlug
    );

    team.summary = record[SUMMARY_KEY];

    const translationLanguages = Object.keys(csvExports).filter(
      l => l !== lang
    );

    team.translations = translationLanguages.map(tl => ({
      lang: tl,
      title: idTitleMap.title[tl],
      url: `/read/${tl}/${englishSlug}`
    }));

    const aboutSection = {
      title: "About",
      cardType: "table",
      facts: [
        { label: "Location", value: { label: record[LOCATION_KEY] } },
        {
          label: "Established on",
          value: { label: record[ESTABLISHED_ON_KEY] }
        },
        { label: "Association", value: { label: record[ASSOCIATION_KEY] } }
      ]
    };

    const rolesSection = {
      title: "Roles",
      cardType: "avatar",
      label: null,
      facts: ROLES.map(role => ({
        label: record[role[KEY]],
        value: {
          label: record[role[KEY]],
          url: "https://clubpenguin.com",
          image: {
            url: "https://placekitten.com/40/40",
            altText: "Mrrroww"
          }
        }
      }))
    };

    team.sections = [];

    fs.writeFileSync(
      `./static/content/${lang}/${englishSlug}.json`,
      JSON.stringify(team, null, 2)
    );
  });
});
// };
