import React from "react";
import { PropTypes } from "prop-types";

import { LanguageContextConsumer } from "../language_context";

const FONT_MAPPINGS = {
  en: {
    body: {
      fontFamily: "Lato",
      id: "lato",
      url: "https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i"
    },
    headings: {
      fontFamily: "Charter",
      id: "charter",
      url: "/static/fonts/charter/charter.css"
    }
  },
  hi: {
    body: {
      fontFamily: "Noto Sans",
      id: "noto-sans",
      url:
        "https://fonts.googleapis.com/css?family=Noto+Sans:400,700&amp;subset=devanagari"
    },
    headings: {
      fontFamily: "Martel",
      id: "martel",
      url:
        "https://fonts.googleapis.com/css?family=Martel:400,700&amp;subset=devanagari"
    }
  }
};

const makeDefId = font => `defs-font-family-${font.id}`;
const makeStyleId = font => `styles-font-family-${font.id}`;

const isFontLoaded = font => {
  const defElement = document.getElementById(makeDefId(font));
  const styleElement = document.getElementById(makeStyleId(font));

  return defElement && styleElement;
};

const loadFont = (fontType, font) => {
  const linkEl = document.createElement("link");
  linkEl.id = makeDefId(font);
  linkEl.type = "text/css";
  linkEl.rel = "stylesheet";
  linkEl.href = font.url;
  document.head.appendChild(linkEl);

  const styleEl = document.createElement("style");
  styleEl.id = makeStyleId(font);
  document.head.appendChild(styleEl);
  const { sheet } = styleEl;

  if (fontType === "body") {
    sheet.insertRule(`
            body {
              font-family: ${font.fontFamily};
            }
          `);
  } else if (fontType === "headings") {
    sheet.insertRule(`
            h1, h2, h3 {
              font-family: ${font.fontFamily};
            }
          `);
  }
};

export const FontLoader = () => (
  <LanguageContextConsumer>
    {lang => <FontLoaderNoContext lang={lang} />}
  </LanguageContextConsumer>
);

class FontLoaderNoContext extends React.Component {
  componentDidMount() {
    const { lang } = this.props;

    if (!process.browser) {
      return;
    }

    const fonts = FONT_MAPPINGS[lang];

    if (!fonts) {
      return;
    }

    Object.keys(fonts).forEach(fontType => {
      const font = fonts[fontType];

      if (isFontLoaded(font)) {
        return;
      }

      loadFont(fontType, font);
    });
  }

  render() {
    return null;
  }
}

FontLoaderNoContext.propTypes = {
  lang: PropTypes.string.isRequired
};
