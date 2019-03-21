const siteTitle = {
  en: "Wikipedia",
  hi: "विकिपीडिया"
};

export const makeTitle = (title, lang) => `${title} — ${siteTitle[lang]}`;
