import React from "react";
import { useTracking } from "react-tracking";
import { CHANGE_LANGUAGE_FROM_ARTICLE_PAGE } from "../lib/matomo";

import { CoverCard } from "./CoverCard";
import { imagePropTypes, translationsPropTypes } from "../lib/prop_types";
import { LanguageContextConsumer } from "../language_context";
import { articleUiStrings } from "../lib/ui_strings";

export const LanguageSelector = ({ translations, coverImage }) => {
  const tracking = useTracking();

  return (
    <LanguageContextConsumer>
      {lang => {
        const onClick = (event, url) => {
          event.preventDefault();
          tracking.trackEvent(CHANGE_LANGUAGE_FROM_ARTICLE_PAGE(lang));
          window.location.href = url;
        };
        return (
          <section className="wcp-language-selector">
            <h2 className="wcp-language-selector__title">
              {articleUiStrings.readInOtherLanguages[lang]}
            </h2>
            <div className="wcp-language-selector__cards">
              {translations.map(t => {
                return (
                  <CoverCard
                    key={t.title}
                    url={t.url}
                    title={t.title}
                    coverImage={coverImage}
                    coverImageClassName="wcp-language-selector__cover-image"
                    linkText={articleUiStrings.readInLanguage[t.lang]}
                    onClick={onClick}
                  />
                );
              })}
            </div>
          </section>
        );
      }}
    </LanguageContextConsumer>
  );
};

LanguageSelector.propTypes = {
  translations: translationsPropTypes.isRequired,
  coverImage: imagePropTypes.isRequired
};
