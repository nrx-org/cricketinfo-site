import React from "react";

import { LanguageCard } from "./LanguageCard";
import { translationsPropTypes, imagePropTypes } from "../lib/prop_types";
import { LanguageContext } from "../language_context";

const LINK_TEXT = {
  hi: "हिंदी में पढ़े",
  en: "Read in English",
  pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹਿਆ"
};

const TITLE_TEXT = {
  hi: "अन्य भाषाओं में संबंधित लेख",
  en: "Read in other language(s)",
  pa: ""
};

/* eslint-disable react/prefer-stateless-function */
export class LanguageSelector extends React.Component {
  render() {
    const { translations, coverImage } = this.props;
    const lang = this.context;
    const cards = translations.map(t => {
      return (
        <LanguageCard
          key={t.title}
          url={t.url}
          title={t.title}
          coverImage={coverImage}
          coverImageClassName="wcp-language-selector__cover-image"
          linkText={LINK_TEXT[t.lang]}
        />
      );
    });
    return (
      <div className="wcp-language-selector">
        <h2 className="wcp-language-selector__title">{TITLE_TEXT[lang]}</h2>
        <div className="wcp-language-selector__cards">{cards}</div>
      </div>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

LanguageSelector.contextType = LanguageContext;

LanguageSelector.propTypes = {
  translations: translationsPropTypes.isRequired,
  coverImage: imagePropTypes.isRequired
};
