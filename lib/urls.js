const CONTENT_URLS = {
  hi: {
    मंगलयान: "/static/content/hi/mangalyaan.json",
    उत्तर_प्रदेश: "/static/content/hi/uttar_pradesh.json",
    गुप्त_राजवंश: "/static/content/hi/gupta_dynasty.json",
    देवनागरी: "/static/content/hi/devanagiri.json",
    प्रेमचंद: "/static/content/hi/premchand.json"
  },
  en: {
    Mangalyaan: "/static/content/en/mangalyaan.json",
    Priyanka_Chopra: "/static/content/en/priyanka_chopra.json",
    India: "/static/content/en/india.json",
    Narendra_Modi: "/static/content/en/narendra_modi.json"
  }
};

const IMAGE_SHARE_BASE_URL = "http://wikipedia-printer.obvs.io/";

const getBaseUrl = () => {
  if (process.browser) {
    return "";
  }

  if (process.env.NOW_REGION) {
    return "https://wikipedia.obvs.io";
  }

  return "http://localhost:3000";
};

export const articleContentUrl = (articleId, lang) => {
  const relativePath = CONTENT_URLS[lang][articleId];
  if (!relativePath) {
    return null;
  }
  return getBaseUrl() + CONTENT_URLS[lang][articleId];
};

export const articleUrl = (articleId, lang) => {
  return `${getBaseUrl()}/wiki/${lang}/${articleId}`;
};

export const getImageShareUrl = (url, selector) =>
  `${IMAGE_SHARE_BASE_URL}/${url}?selector=${selector}`;
