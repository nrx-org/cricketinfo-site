import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import "../styles/main.scss";

export const BaseLayout = ({ children }) => (
  <main>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </main>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};
