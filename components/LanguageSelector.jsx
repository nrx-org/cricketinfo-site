import React from "react";
import { useTranslation } from "react-i18next";

import { LanguageCard } from "./LanguageCard";
import { Button } from "./Button";
import { translationsPropTypes, imagePropTypes } from "../lib/prop_types";
import { LanguageContextConsumer } from "../language_context";

const LINK_TEXT = {
  hi: "हिंदी में पढ़े",
  en: "Read in English",
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

export const LanguageSelector = ({ translations, coverImage }) => {
  const { t } = useTranslation();

  return (
    <LanguageContextConsumer>
      {lang => (
        <div>
          <h2 className="wcp-language-selector__title">{TITLE_TEXT[lang]}</h2>
          <div className="wcp-language-selector__cards">
            {translations.map(t => (
              <LanguageCard
                key={t.title}
                url={t.url}
                title={t.title}
                coverImage={coverImage}
                coverImageClassName="wcp-language-selector__cover-image"
                linkText={LINK_TEXT[t.lang]}
              />
            ))}
          </div>
          <Button type="inverted" className="wcp-language-selector__cta">
            {t("LanguageSelector.see_more_languages")}
          </Button>
        </div>
      )}
    </LanguageContextConsumer>
  );
};

LanguageSelector.propTypes = {
  translations: translationsPropTypes.isRequired,
  coverImage: imagePropTypes.isRequired
};
