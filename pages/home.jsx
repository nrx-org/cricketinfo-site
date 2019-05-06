import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { LanguageContext } from "../language_context";
import { makeSiteTitle } from "../lib/make_title";
import { homeContentUrl } from "../lib/urls";
import { SwitchLanguageFloatingToolbar } from "../components/SwitchLanguageFloatingToolbar";

import { translationsPropTypes } from "../lib/prop_types";

const Home = ({ lang, translations }) => (
  <LanguageContext.Provider lang={lang}>
    <BaseLayout>
      <Head>
        <title>{makeSiteTitle(lang)}</title>
      </Head>
      <header className="wcp-home__header">
        <img
          className="wcp-home__logo"
          src="/static/images/world_cup_logo.svg"
          alt="World Cup logo"
        />
      </header>
      <SwitchLanguageFloatingToolbar translations={translations} />
    </BaseLayout>
  </LanguageContext.Provider>
);

Home.getInitialProps = async ({ query }) => {
  const { lang } = query;

  const homeResponse = await fetch(homeContentUrl(lang));
  const homeJson = await homeResponse.json();

  return { lang, ...homeJson };
};

Home.propTypes = {
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired
};

export default Home;
