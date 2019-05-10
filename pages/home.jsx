import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { LanguageContext } from "../language_context";
import { makeSiteTitle } from "../lib/make_title";
import { homeContentUrl } from "../lib/urls";
import { SwitchLanguageFloatingToolbar } from "../components/SwitchLanguageFloatingToolbar";

import { factPropTypes, translationsPropTypes } from "../lib/prop_types";
import {
  ModalContextConsumer,
  ModalContextProvider
} from "../components/ModalContext";
import { PlayingTeams } from "../components/PlayingTeams";
import { FunFacts } from "../components/FunFacts";
import { ShareModalContainer } from "../components/ShareModalContainer";
import { FeaturedPlayers } from "../components/FeaturedPlayers";

const Home = ({
  lang,
  translations,
  playingTeams,
  participatingTeams,
  scheduledFacts,
  constantFacts,
  scheduledFeaturedPlayers,
  constantFeaturedPlayers,
  allPlayers
}) => (
  <LanguageContext.Provider value={lang}>
    <ModalContextProvider>
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
        <PlayingTeams teams={playingTeams} allTeams={participatingTeams} />
        <FunFacts scheduled={scheduledFacts} constant={constantFacts} />
        <FeaturedPlayers
          scheduled={scheduledFeaturedPlayers}
          constant={constantFeaturedPlayers}
          all={allPlayers}
        />
        <ModalContextConsumer>
          {({ registerModal, isModalOpen, modalData, closeModal }) => (
            <ShareModalContainer
              registerModal={registerModal}
              isModalOpen={isModalOpen}
              modalData={modalData}
              closeModal={closeModal}
              lang={lang}
            />
          )}
        </ModalContextConsumer>
      </BaseLayout>
    </ModalContextProvider>
  </LanguageContext.Provider>
);

Home.getInitialProps = async ({ query }) => {
  const { lang } = query;

  const homeResponse = await fetch(homeContentUrl(lang));
  const homeJson = await homeResponse.json();

  return { lang, ...homeJson };
};

Home.defaultProps = {
  playingTeams: [],
  participatingTeams: []
};

Home.propTypes = {
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired,

  // A list of teams tagged with the dates they are playing on.
  playingTeams: PropTypes.arrayOf(factPropTypes),

  // A list of all teams participating in the world cup.
  participatingTeams: PropTypes.arrayOf(factPropTypes),

  // A list of "fun facts" tagged with the dates they should appear on.
  scheduledFacts: PropTypes.arrayOf(factPropTypes).isRequired,

  // A static list of "fun facts" that will appear every day.
  constantFacts: PropTypes.arrayOf(factPropTypes).isRequired,

  // A list of players tagged with the dates on which they should be featured.
  scheduledFeaturedPlayers: PropTypes.arrayOf(factPropTypes).isRequired,

  // A static list of players who will always appear in the featured players
  // list.
  constantFeaturedPlayers: PropTypes.arrayOf(factPropTypes).isRequired,

  // A static list of players who will appear in the all players modal.
  allPlayers: PropTypes.arrayOf(factPropTypes).isRequired
};

export default Home;
