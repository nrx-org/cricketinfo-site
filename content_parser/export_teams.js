const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const idMap = require("../static/content/article_ids.json");
const {
  findIdMapEntryById,
  getSluggedTitle,
  getCardInfoFromId,
  downloadImageAndFillAttributions
} = require("./lib");

const { teamUIStrings } = require("./ui_strings");

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
const ESTABLISHED_ON_KEY = "Established On";
const ASSOCIATION_KEY = "Association";

const ROLES = [
  {
    KEY: "Test Captain name",
    UI_STRING_KEY: "testCaptainRoleTitle",
    IMAGE_KEY: "Test Captain image link",
    ARTICLE_CODE_KEY: "Test Captain article code"
  },
  {
    KEY: "ODI Captain name",
    UI_STRING_KEY: "ODICaptainRoleTitle",
    IMAGE_KEY: "ODI Captain image link",
    ARTICLE_CODE_KEY: "ODI Captain article code"
  },
  {
    KEY: "T20I Captain name",
    UI_STRING_KEY: "T20ICaptainRoleTitle",
    IMAGE_KEY: "T20I Captain image link",
    ARTICLE_CODE_KEY: "T20I Captain article code"
  },
  {
    KEY: "Coach Name",
    UI_STRING_KEY: "coachRoleTitle",
    IMAGE_KEY: "Coach image link",
    ARTICLE_CODE_KEY: "Coach article code"
  }
];

const VENUE_NAME_KEY = "Venue Name";
const VENUE_DESCRIPTION_KEY = "Venue Description";
const VENUE_IMAGE_LINK_KEY = "Venue Image Link";

const HISTORY = [
  {
    HISTORY_TITLE_KEY: "History Phase 1 Title",
    HISTORY_DATES_KEY: "History Phase 1 Dates",
    HISTORY_BRIEF_DESCRIPTION_KEY: "History Phase 1 brief description",
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
    HISTORY_TITLE_KEY: "History Phase 2 Title",
    HISTORY_DATES_KEY: "History Phase 2 Dates",
    HISTORY_BRIEF_DESCRIPTION_KEY: "History Phase 2 brief description",
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
    HISTORY_TITLE_KEY: "History Phase 3 Title",
    HISTORY_DATES_KEY: "History Phase 3 Dates",
    HISTORY_BRIEF_DESCRIPTION_KEY: "History Phase 3 brief description",
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
    HISTORY_TITLE_KEY: "History Phase 4 Title",
    HISTORY_DATES_KEY: "History Phase 4 Dates",
    HISTORY_BRIEF_DESCRIPTION_KEY: "History Phase 4 brief description",
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
    SPONSOR_NAME: "Sponsor  Type 1 name",
    SPONSOR_IMAGE_URL: "Sponsor Type 1 Image URL"
  },
  {
    SPONSOR_TYPE: "Sponsor Type 2",
    SPONSOR_NAME: "Sponsor Type 2 Name",
    SPONSOR_IMAGE_URL: "Sponsor Type 2 Image URL"
  },
  {
    SPONSOR_TYPE: "Sponsor Type 3",
    SPONSOR_NAME: "Sponsor Type 3 Name",
    SPONSOR_IMAGE_URL: "Sponsor Type 3 Image URL"
  },
  {
    SPONSOR_TYPE: "Sponsor Type 4",
    SPONSOR_NAME: "Sponsor Type 4 Name",
    SPONSOR_IMAGE_URL: "Sponsor Type 4 Image URL"
  }
];

// TODO: instead of auto-generating IDs, generate them from labels, slugs, indexes, etc.

module.exports.exportTeams = () => {
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
        title: teamUIStrings.aboutSectionTitle[lang],
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
        title: teamUIStrings.rolesSectionTitle[lang],
        cardType: "avatar",
        label: null,
        facts: await Promise.all(
          ROLES.map(async role => {
            const card = getCardInfoFromId(
              idMap,
              record[role.ARTICLE_CODE_KEY],
              lang
            );

            return {
              label: teamUIStrings[role.UI_STRING_KEY][lang],
              value: {
                label: record[role.KEY],
                url: card ? card.url : null,
                image: await downloadImageAndFillAttributions(
                  {
                    url: record[role.IMAGE_KEY],
                    altText: `Image of ${record[role.KEY]}`
                  },
                  englishSlug
                )
              }
            };
          })
        )
      };

      const popularVenueSection = {
        title: teamUIStrings.popularVenueSectionTitle[lang],
        id: `${englishSlug}_popular_venues`,
        cardType: "simple",
        facts: [
          {
            label: record[VENUE_NAME_KEY],
            value: {
              label: record[VENUE_DESCRIPTION_KEY],
              image: await downloadImageAndFillAttributions(
                {
                  url: record[VENUE_IMAGE_LINK_KEY],
                  altText: `Image of ${record[VENUE_NAME_KEY]}`
                },
                englishSlug
              )
            }
          }
        ]
      };

      const historySection = {
        title: teamUIStrings.historySectionTitle[lang],
        cardType: "vertical_timeline",
        facts: await Promise.all(
          HISTORY.map(async (historyItem, index) => {
            return {
              label: record[historyItem.HISTORY_TITLE_KEY],
              id: `${englishSlug}_history_${index}`,
              note: record[historyItem.HISTORY_DATES_KEY],
              value: {
                label: record[historyItem.HISTORY_BRIEF_DESCRIPTION_KEY],
                facts: (await Promise.all(
                  historyItem.CARDS.map(async (historyItemCard, innerIndex) => {
                    const card = getCardInfoFromId(
                      idMap,
                      record[historyItemCard.CARD_ARTICLE_CODE],
                      lang
                    );

                    if (
                      !record[historyItemCard.CARD_IMAGE_URL] ||
                      record[historyItemCard.CARD_IMAGE_URL].length === 0
                    ) {
                      return null;
                    }
                    return {
                      label: record[historyItemCard.CARD_TITLE_KEY],
                      url: card ? card.url : null,
                      id: `${englishSlug}_history_${index}_fact_${innerIndex}`,
                      value: {
                        label:
                          record[historyItemCard.CARD_BRIEF_DESCRIPTION_KEY],
                        image: await downloadImageAndFillAttributions(
                          {
                            url: record[historyItemCard.CARD_IMAGE_URL],
                            altText: `Image of ${
                              record[historyItemCard.CARD_TITLE_KEY]
                            }`
                          },
                          englishSlug
                        )
                      }
                    };
                  })
                )).filter(Boolean)
              }
            };
          })
        )
      };

      const famousPlayersSection = {
        title: teamUIStrings.famousPlayersSectionTitle[lang],
        cardType: "stories",
        facts: (await Promise.all(
          PLAYERS.map(async (player, index) => {
            if (
              !record[player.PLAYER_IMAGE_URL_KEY] ||
              record[player.PLAYER_IMAGE_URL_KEY].length === 0
            ) {
              return null;
            }
            return {
              label: record[player.PLAYER_NAME_KEY],
              id: `${englishSlug}_player_${index}`,
              value: {
                url: null,
                label: record[player.PLAYER_DESCRIPTION_KEY],
                image: await downloadImageAndFillAttributions(
                  {
                    url: record[player.PLAYER_IMAGE_URL_KEY],
                    altText: `Image of ${record[player.PLAYER_NAME_KEY]}`
                  },
                  englishSlug
                )
              }
            };
          })
        )).filter(Boolean)
      };

      const achievementsSection = {
        title: teamUIStrings.achievementsSectionTitle[lang],
        cardType: "list_card",
        facts: (await Promise.all(
          ACHIEVEMENTS.map(async (achievement, index) => {
            if (!record[achievement.ACHIEVEMENT_TITLE]) {
              return null;
            }

            const card = getCardInfoFromId(
              idMap,
              record[achievement.ACHIEVEMENT_CARD_CODE],
              lang
            );

            return {
              label: record[achievement.ACHIEVEMENT_TITLE],
              id: `${englishSlug}_achievement_${index}`,
              note: null,
              value: {
                label: record[achievement.ACHIEVEMENT_DESCRIPTION],
                facts:
                  record[achievement.ACHIEVEMENT_CARD_TITLE] ||
                  (card && card.title)
                    ? [
                        {
                          label: record[achievement.ACHIEVEMENT_CARD_TITLE]
                            ? record[achievement.ACHIEVEMENT_CARD_TITLE]
                            : card.title,
                          id: `${englishSlug}_achivement_${index}_fact`,
                          url: card ? card.url : null,

                          value: {
                            label: card ? card.summary : null,
                            image: await downloadImageAndFillAttributions(
                              {
                                url: record[achievement.ACHIEVEMENT_CARD_URL],
                                altText: `Image of ${
                                  record[achievement.ACHIEVEMENT_TITLE]
                                }`
                              },
                              englishSlug
                            )
                          }
                        }
                      ]
                    : []
              }
            };
          })
        )).filter(Boolean)
      };

      const sponsorsSection = {
        title: teamUIStrings.sponsorsSectionTitle[lang],
        cardType: "avatar",
        label: null,
        facts: (await Promise.all(
          SPONSORS.map(async sponsor => {
            const card = getCardInfoFromId(
              idMap,
              record[sponsor.ARTICLE_CODE_KEY],
              lang
            );

            if (!record[sponsor.SPONSOR_NAME]) {
              return null;
            }

            return {
              label: record[sponsor.SPONSOR_TYPE],
              value: {
                label: record[sponsor.SPONSOR_NAME],
                url: card ? card.url : null,
                image: await downloadImageAndFillAttributions(
                  {
                    url: record[sponsor.SPONSOR_IMAGE_URL],
                    altText: `Image of ${record[sponsor.SPONSOR_NAME]}`
                  },
                  englishSlug
                )
              }
            };
          })
        )).filter(Boolean)
      };

      team.sections = [];
      team.sections.push(aboutSection);
      team.sections.push(rolesSection);
      team.sections.push(popularVenueSection);
      team.sections.push(historySection);
      team.sections.push(famousPlayersSection);
      team.sections.push(achievementsSection);
      team.sections.push(sponsorsSection);

      team.category = "team";

      fs.writeFileSync(
        `./static/content/${lang}/${englishSlug}.json`,
        JSON.stringify(team, null, 2)
      );
    });
  });
};
