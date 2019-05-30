import React from "react";

import { CoverCard } from "./CoverCard";
import { imagePropTypes, translationsPropTypes } from "../lib/prop_types";
import { LanguageContextConsumer } from "../language_context";
import { articleUiStrings } from "../lib/ui_strings";

export const LanguageSelector = ({ translations, coverImage }) => {
  return (
    <LanguageContextConsumer>
      {lang => (
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
                />
              );
            })}
          </div>
        </section>
      )}
    </LanguageContextConsumer>
  );
};

LanguageSelector.propTypes = {
  translations: translationsPropTypes.isRequired,
  coverImage: imagePropTypes.isRequired
};
