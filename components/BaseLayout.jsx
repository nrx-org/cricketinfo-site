import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

export const BaseLayout = ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </div>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};
