import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { LanguageContext } from "../language_context";
import { makeSiteTitle } from "../lib/make_title";
import { homeContentUrl } from "../lib/urls";
import { SwitchLanguageFloatingToolbar } from "../components/SwitchLanguageFloatingToolbar";

import {
  factPropTypes,
  quizQuestionPropType,
  translationsPropTypes,
  factCardDataPropTypes,
  imagePropTypes
} from "../lib/prop_types";
import {
  ModalContextConsumer,
  ModalContextProvider
} from "../components/ModalContext";
import { PlayingTeams } from "../components/PlayingTeams";
import { PopularArticles } from "../components/PopularArticles";
import { FunFacts } from "../components/FunFacts";
import { Timeline } from "../components/Timeline";
import { InterestingArticles } from "../components/InterestingArticles";
import { ShareModalContainer } from "../components/ShareModalContainer";
import { FeaturedPlayers } from "../components/FeaturedPlayers";
import { QuizContainer } from "../components/QuizContainer";
import { getImageAttributions } from "../lib/image_attributions";
import { ImageAttributions } from "../components/ImageAttributions";
import { ImageAttributionsModalContainer } from "../components/ImageAttributionsModalContainer";
import { ArticleSummaryModalContainer } from "../components/ArticleSummaryModalContainer";
import { HomeHeader } from "../components/HomeHeader";

const Home = ({
  lang,
  translations,
  playingTeams,
  participatingTeams,
  horizontalTimeline,
  scheduledFacts,
  constantFacts,
  popularArticles,
  scheduledFeaturedPlayers,
  constantFeaturedPlayers,
  allPlayers,
  quizQuestions,
  interestingArticles,
  imageAttributions
}) => (
  <LanguageContext.Provider value={lang}>
    <ModalContextProvider>
      <BaseLayout>
        <Head>
          <title>{makeSiteTitle(lang)}</title>
        </Head>

        <HomeHeader />

        <SwitchLanguageFloatingToolbar translations={translations} />
        <PlayingTeams teams={playingTeams} allTeams={participatingTeams} />
        <Timeline
          type="horizontal"
          innerCardType="large"
          cardData={horizontalTimeline}
        />
        <PopularArticles popularArticles={popularArticles} />
        <FunFacts scheduled={scheduledFacts} constant={constantFacts} />
        <FeaturedPlayers
          scheduled={scheduledFeaturedPlayers}
          constant={constantFeaturedPlayers}
          all={allPlayers}
        />
        <QuizContainer questions={quizQuestions} />
        <InterestingArticles interestingArticles={interestingArticles} />
        <ImageAttributions attributions={imageAttributions} lang={lang} />

        <ModalContextConsumer>
          {({ registerModal, isModalOpen, modalData, closeModal }) => (
            <>
              <ArticleSummaryModalContainer
                registerModal={registerModal}
                isModalOpen={isModalOpen}
                modalData={modalData}
                closeModal={closeModal}
              />
              <ShareModalContainer
                registerModal={registerModal}
                isModalOpen={isModalOpen}
                modalData={modalData}
                closeModal={closeModal}
                lang={lang}
              />
              <ImageAttributionsModalContainer
                registerModal={registerModal}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                modalData={modalData}
              />
            </>
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
  const imageAttributions = getImageAttributions(homeJson);

  return { lang, imageAttributions, ...homeJson };
};

Home.defaultProps = {
  playingTeams: [],
  participatingTeams: [],
  horizontalTimeline: {}
};

Home.propTypes = {
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired,
  imageAttributions: PropTypes.arrayOf(imagePropTypes).isRequired,

  // A list of teams tagged with the dates they are playing on.
  playingTeams: PropTypes.arrayOf(factPropTypes),

  // A list of all teams participating in the world cup.
  participatingTeams: PropTypes.arrayOf(factPropTypes),
  horizontalTimeline: factCardDataPropTypes,

  // A list of all popular articles grouped by columns.
  popularArticles: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.arrayOf(factPropTypes)),
    title: PropTypes.string,
    id: PropTypes.string
  }).isRequired,

  // A list of "fun facts" tagged with the dates they should appear on.
  scheduledFacts: PropTypes.arrayOf(factPropTypes).isRequired,

  // A static list of "fun facts" that will appear every day.
  constantFacts: PropTypes.arrayOf(factPropTypes).isRequired,

  // A list of players tagged with the dates on which they should be featured.
  scheduledFeaturedPlayers: PropTypes.arrayOf(factPropTypes).isRequired,

  // A static list of players who will always appear in the featured players
  // list.
  constantFeaturedPlayers: PropTypes.arrayOf(factPropTypes).isRequired,

  // A list of all interesting articles.
  interestingArticles: PropTypes.arrayOf(factPropTypes).isRequired,

  // A static list of players who will appear in the all players modal.
  allPlayers: PropTypes.arrayOf(factPropTypes).isRequired,

  // A list of pre-scheduled quiz questions
  quizQuestions: PropTypes.arrayOf(quizQuestionPropType).isRequired
};

export default Home;
