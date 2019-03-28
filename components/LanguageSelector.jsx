import React from "react";
import PropTypes from "prop-types";

import { LanguageCard } from "./LanguageCard";
import { translationsPropTypes } from "../lib/prop_types";

const LINK_TEXT = {
  hi: "हिंदी में पढ़े",
  en: "Read in Punjabi",
  pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹਿਆ"
};

const TITLE_TEXT = {
  hi: "अन्य भाषाओं में संबंधित लेख",
  en: "In other languages",
  pa: ""
};

const MORE_LANGUAGES_TEXT = {
  hi: "अन्य भाषाओं में पढ़ें",
  en: "See more languages",
  pa: ""
};

export const LanguageSelector = ({ translations, coverImage, lang }) => {
  const cards = translations.map(t => {
    return (
      <LanguageCard
        url={t.url}
        title={t.title}
        coverImage={coverImage}
        linkText={LINK_TEXT[t.lang]}
      />
    );
  });

  return (
    <div>
      <h2>{TITLE_TEXT[lang]}</h2>
      {cards}
      <button type="button">{MORE_LANGUAGES_TEXT[lang]}</button>
    </div>
  );
};

LanguageSelector.propTypes = {
  translations: translationsPropTypes.isRequired,
  coverImage: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};
