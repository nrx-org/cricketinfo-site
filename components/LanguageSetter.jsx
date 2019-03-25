import React from "react";
import PropTypes from "prop-types";

const setLanguage = lang => {
  document.documentElement.setAttribute("lang", lang);
};

export class LanguageSetter extends React.Component {
  componentDidMount() {
    const { lang } = this.props;

    if (process.browser) {
      setLanguage(lang);
    }
  }

  componentDidUpdate(prevProps) {
    if (process.browser) {
      setLanguage(prevProps.lang);
    }
  }

  render() {
    return null;
  }
}

LanguageSetter.propTypes = {
  lang: PropTypes.string.isRequired
};
