import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import { LanguageSetter } from "./LanguageSetter";
import { setCommitSHA1 } from "../lib/set_commit_sha1";

import "../styles/main.scss";

setCommitSHA1();

export const BaseLayout = ({ children }) => (
  <main>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" type="image/x-icon" href="/static/images/favicon.ico" />
      <link
        href="https://fonts.googleapis.com"
        rel="preconnect"
        crossOrigin="true"
      />
    </Head>
    <LanguageSetter />
    {children}
  </main>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};
