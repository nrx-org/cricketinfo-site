import React from "react";
import { LanguageContext } from "../language-context";

const setLanguage = lang => {
  document.documentElement.setAttribute("lang", lang);
};

export class LanguageSetter extends React.Component {
  componentDidMount() {
    const lang = this.context;

    if (process.browser) {
      setLanguage(lang);
    }
  }

  componentDidUpdate() {
    if (process.browser) {
      const lang = this.context;
      setLanguage(lang);
    }
  }

  render() {
    return null;
  }
}

LanguageSetter.contextType = LanguageContext;
