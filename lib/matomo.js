export const MATOMO_SCRIPT_URL =
  "//cdn.matomo.cloud/cricketinfo.matomo.cloud/matomo.js";
export const MATOMO_TRACKER_URL = "https://cricketinfo.matomo.cloud/matomo.php";
export const MATOMO_SITEID = "1";

const isHomePage = () => {
  return window && window.location.pathname.match(/\/read\/(en|hi|ta)\/?$/g);
};

const isArticlePage = () => {
  return window && window.location.pathname.match(/\/read\/(en|hi|ta)\/.{1,}/g);
};

const getPagePrefix = () => {
  let prefix = null;
  if (isHomePage()) {
    prefix = "HOME";
  } else if (isArticlePage()) {
    prefix = "ARTICLE";
  } else {
    prefix = "";
  }

  return prefix;
};

// Custom Events for Matomo

export const SET_ARTICLE_CATEGORY = category => {
  return ["setCustomVariable", 1, "Article Category", category, "page"];
};

export const CHANGE_LANGUAGE_FROM_ARTICLE_PAGE = lang => {
  return [
    "trackEvent",
    "user_interaction",
    "CHANGE_LANGUAGE_FROM_ARTICLE_PAGE",
    lang
  ];
};

export const CHANGE_LANGUAGE_FROM_HOME_PAGE = lang => {
  return [
    "trackEvent",
    "user_interaction",
    "CHANGE_LANGUAGE_FROM_HOME_PAGE",
    lang
  ];
};

export const SHARE_FLAT_CARD = value => {
  return ["trackEvent", "user_interaction", "SHARE_FLAT_CARD", value];
};

export const SHARE_FLAT_CARD_LINK_ERROR = () => [
  "trackEvent",
  "user_interaction",
  "SHARE_FLAT_CARD_LINK_ERROR"
];

export const OPEN_STORY_FULL_SCREEN = value => {
  return ["trackEvent", "user_interaction", "OPEN_STORY_FULL_SCREEN", value];
};

export const LIKE_STORY = value => {
  return ["trackEvent", "user_interaction", "LIKE_STORY", value];
};

export const SHARE_STORY = value => {
  return ["trackEvent", "user_interaction", "SHARE_STORY", value];
};

export const SCROLL_TOURNAMENT_HISTORY = [
  "trackEvent",
  "user_interaction",
  "SCROLL_TOURNAMENT_HISTORY"
];

export const CLICK_SHARE_LARGE_CARD = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_SHARE_LARGE_CARD",
    `${getPagePrefix()}__${value}`
  ];
};

export const CLICK_KNOW_MORE_LARGE_CARD = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_KNOW_MORE_LARGE_CARD",
    `${getPagePrefix()}__${value}`
  ];
};

export const CLICK_TINY_CARD = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_SHARE_TINY_CARD",
    `${getPagePrefix()}__${value}`
  ];
};

export const CLICK_READ_MORE_ON_WIKIPEDIA = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_READ_MORE_ON_WIKIPEDIA",
    value
  ];
};

export const CLICK_PROCEED_TO_WIKIPEDIA = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_PROCEED_TO_WIKIPEDIA",
    value
  ];
};

export const CLICK_CANCEL_PROCEEDING_TO_WIKIPEDIA = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_CANCEL_PROCEEDING_TO_WIKIPEDIA",
    value
  ];
};

export const CLICK_QUIZ_ANSWER = value => {
  return ["trackEvent", "user_interaction", "CLICK_QUIZ_ANSWER", value];
};

export const QUIZ_ANSWER_CORRECT = value => {
  return ["trackEvent", "user_interaction", "QUIZ_ANSWER_CORRECT", value];
};

export const QUIZ_ANSWER_WRONG = value => {
  return ["trackEvent", "user_interaction", "QUIZ_ANSWER_WRONG", value];
};

export const CLICK_QUIZ_RELATED_ANSWER = value => {
  return ["trackEvent", "user_interaction", "CLICK_QUIZ_RELATED_ANSWER", value];
};

export const CLICK_INTERESTING_ARTICLE = value => {
  return ["trackEvent", "user_interaction", "CLICK_INTERESTING_ARTICLE", value];
};

export const CLICK_POPULAR_ARTICLE = value => {
  return ["trackEvent", "user_interaction", "CLICK_POPULAR_ARTICLE", value];
};

export const CLICK_ALL_PARTICIPATING_TEAMS = value => {
  return [
    "trackEvent",
    "user_interaction",
    "CLICK_ALL_PARTICIPATING_TEAMS",
    value
  ];
};

export const CLICK_ALL_PLAYERS = value => {
  return ["trackEvent", "user_interaction", "CLICK_ALL_PLAYERS", value];
};

export const SAVE_FOR_LATER_CLICK = [
  "trackEvent",
  "user_interaction",
  "SAVE_FOR_LATER_CLICK"
];
export const SAVE_FOR_LATER_SHARE_NUMBER = [
  "trackEvent",
  "user_interaction",
  "SAVE_FOR_LATER_SHARE_NUMBER"
];
export const SAVE_FOR_LATER_INTERESTED = [
  "trackEvent",
  "user_interaction",
  "SAVE_FOR_LATER_INTERESTED"
];
export const SAVE_FOR_LATER_DOWNLOAD_PDF = [
  "trackEvent",
  "user_interaction",
  "SAVE_FOR_LATER_DOWNLOAD_PDF"
];
