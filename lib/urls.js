import cloudinary from "cloudinary-core";
import CONTENT_URLS from "../static/content/article_urls";

// eslint-disable-next-line dot-notation
CONTENT_URLS["en"]["debug"] = "/static/content/en/debug.json";

const SCREENSHOT_SERVICE_BASE_URL = "https://sharecricketinfo.io";

const getBaseUrl = () => {
  if (process.browser) {
    return "";
  }

  if (process.env.NOW_REGION) {
    return "https://cricketinfo.io";
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

export const getHomeUrl = lang => `${getBaseUrl()}/read/${lang}`;

export const homeContentUrl = lang =>
  `${getBaseUrl()}/static/content/${lang}/home.json`;

export const getAbsoluteArticleUrl = (articleId, lang) => {
  const absoluteBaseUrl = process.env.NOW_REGION
    ? "https://cricketinfo.io"
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

export const getFlagImageUrl = name => `/static/images/flags/${name}.svg`;

export const getBasename = url => url.substr(url.lastIndexOf("/") + 1);

export const getPrivacyPolicyUrl = lang => `/privacy_policy/${lang}`;

export const getSurveyUrl = (lang, userId, articleId) =>
  `https://wikimedia.qualtrics.com/jfe/form/SV_eD7wkmfk6GEve3b?language=${lang}&userId=${userId}&articleId=${articleId}`;

export const getContactFormUrl = lang =>
  ({
    en: "https://forms.gle/5jiFKo7y12CWf6zb8",
    hi: "https://forms.gle/CrHZA2Fqtf4u25Bf9",
    ta: "https://forms.gle/LFjUf1C3brusswscA"
  }[lang]);

export const getTermsOfUseUrl = () =>
  "https://foundation.wikimedia.org/wiki/Terms_of_Use/en";

export const CLOUDINARY_CLOUD_NAME = "cricwiki";

export const getCloudinaryUrl = url => {
  const cl = new cloudinary.Cloudinary({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    secure: true
  });

  return process.env.NODE_ENV === "development"
    ? url
    : cl.url(url, {
        secure: "true",
        crop: "fit",
        width: 1200,
        quality: "auto:good",
        fetchFormat: "auto"
      });
};

export const getImageShareApiUrl = (url, selector) =>
  `${SCREENSHOT_SERVICE_BASE_URL}/screenshot?url=${url}&selector=${encodeURIComponent(
    selector
  )}`;
