import React from "react";
import PropTypes from "prop-types";
import i18n from "i18next";
import { withTranslation } from "react-i18next";

import { initReactI18next } from "react-i18next";

const LanguageContext = React.createContext();

const initializeI18next = (translations, lang) => {
  i18n.use(initReactI18next).init({
    resources: {
      [lang]: translations
    },
    lng: lang,
    interpolation: {
      escapeValue: false
    }
  });
};
class LanguageContextProviderInternal extends React.Component {
  constructor(props) {
    super(props);
    const { translations, lang } = props;
    console.log("init i18n librari, translasbungs", translations, lang);
    initializeI18next(translations, lang);
    const { t } = props;
    console.log(t("LanguageSelector.see_more_languages"));
  }

  render() {
    const { lang, children } = this.props;

    return (
      <LanguageContext.Provider value={lang}>
        {children}
      </LanguageContext.Provider>
    );
  }
}

export const LanguageContextProvider = withTranslation()(LanguageContextProviderInternal);

LanguageContextProviderInternal.propTypes = {
  lang: PropTypes.string.isRequired,
  // Because the shape is too large and constantly changing,
  // eslint-disable-next-line react/forbid-prop-types
  translations: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export const LanguageContextConsumer = LanguageContext.Consumer;
