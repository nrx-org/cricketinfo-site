// TODO: this file doesn't take different types of deployments into account.
// It assumes we'll always deploy on Now, and always using the Obvious staging
// account. Pls fix saar.

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

const SCREENSHOT_SERVICE_BASE_URL = "http://wikipedia-printer.obvs.io";

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

export const getAbsoluteArticleUrl = (articleId, lang) => {
  const absoluteBaseUrl = process.env.NOW_REGION
    ? "https://wikipedia.obvs.io"
    : "http://localhost:3000";
  return `${absoluteBaseUrl}/wiki/${lang}/${articleId}`;
};

export const articleUrl = (articleId, lang) => {
  return `${getBaseUrl()}/wiki/${lang}/${articleId}`;
};

export const getImageShareUrl = (url, selector) =>
  `${SCREENSHOT_SERVICE_BASE_URL}/${url}?selector=${encodeURIComponent(
    selector
  )}`;

export const getPdfShareUrl = url =>
  `${SCREENSHOT_SERVICE_BASE_URL}/${url}?type=pdf`;
