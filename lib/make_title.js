const siteTitle = {
  en: "CricketInfo",
  hi: "क्रिकेट इनफो"
};

export const makeSiteTitle = lang => siteTitle[lang];

export const makeArticleTitle = (title, lang) =>
  `${title} — ${siteTitle[lang]}`;
