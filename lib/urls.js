// TODO: this file doesn't take different types of deployments into account.
// It assumes we'll always deploy on Now, and always using the Obvious staging
// account. Pls fix saar.

// SCHEMA
// {"CONTENT_URLS": {"hi": {},  "en": {},   "ta": {} }}

import CONTENT_URLS from "../bin/content_urls.json";

// eslint-disable-next-line dot-notation
CONTENT_URLS["en"]["debug"] = "/static/content/en/debug.json";

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

export const getMainPageUrl = lang => `${getBaseUrl()}/read/${lang}`;

export const articleContentUrl = (articleId, lang) => {
  const relativePath = CONTENT_URLS[lang][articleId];
  if (!relativePath) {
    return null;
  }
  return getBaseUrl() + CONTENT_URLS[lang][articleId];
};

export const homeContentUrl = lang =>
  `${getBaseUrl()}/static/content/${lang}/home.json`;

export const getAbsoluteArticleUrl = (articleId, lang) => {
  const absoluteBaseUrl = process.env.NOW_REGION
    ? "https://wikipedia.obvs.io"
    : "http://localhost:3000";
  return `${absoluteBaseUrl}/read/${lang}/${articleId}`;
};

export const articleUrl = (articleId, lang) => {
  return `${getBaseUrl()}/read/${lang}/${articleId}`;
};

export const getImageShareUrl = (url, selector) =>
  `${SCREENSHOT_SERVICE_BASE_URL}/${url}?selector=${encodeURIComponent(
    selector
  )}`;

export const getPdfShareUrl = url =>
  `${SCREENSHOT_SERVICE_BASE_URL}/${url}?type=pdf`;
