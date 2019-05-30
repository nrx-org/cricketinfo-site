const siteTitle = {
  en: "CricketInfo",
  hi: "क्रिकेट इनफो",
  ta: "கிரிக்கெட்இன்ஃபோ"
};

export const makeSiteTitle = lang => siteTitle[lang];

export const makeArticleTitle = (title, lang) =>
  `${title} — ${siteTitle[lang]}`;
