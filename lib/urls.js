const CONTENT_URLS = {
  hi: {
    मंगलयान: "/static/content/hi/mangalyaan.json"
  }
};

const getBaseUrl = () => {
  if (process.browser) {
    return "";
  }

  if (process.env.IS_NOW) {
    return "https://wikipedia.obvs.io";
  }

  return "http://localhost:3000";
};

export const articleUrl = (articleId, lang) => {
  return getBaseUrl() + CONTENT_URLS[lang][articleId];
};
