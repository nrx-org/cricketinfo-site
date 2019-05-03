const siteTitle = {
  en: "Wikipedia",
  hi: "विकिपीडिया"
};

export const makeSiteTitle = lang => siteTitle[lang];

export const makeArticleTitle = (title, lang) =>
  `${title} — ${siteTitle[lang]}`;
