import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import { FontLoader } from "./FontLoader";

import "../styles/main.scss";

export const BaseLayout = ({ children, lang }) => (
  <main>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <FontLoader lang={lang} />
    {children}
  </main>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  lang: PropTypes.string.isRequired
};
