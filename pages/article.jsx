import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { ArticleContent } from "../components/ArticleContent";
import { LanguageSelector } from "../components/LanguageSelector";
import { LanguageContext } from "../language_context";
import { FactCard } from "../components/FactCard";
import {
  ModalContextProvider,
  ModalContextConsumer
} from "../components/ModalContext";
import { ArticleSummaryModalContainer } from "../components/ArticleSummaryModalContainer";
import { ShareFactBottomSheetContainer } from "../components/ShareFactBottomSheetContainer";
import { FloatingToolbarContainer } from "../components/FloatingToolbarContainer";

import { makeTitle } from "../lib/make_title";
import { articleContentUrl } from "../lib/urls";
import {
  sectionsPropTypes,
  translationsPropTypes,
  imagePropTypes,
  factCardDataPropTypes
} from "../lib/prop_types";

const Article = ({
  articleId,
  title,
  sections,
  lang,
  summary,
  coverImage,
  summaryFactCards,
  translations
}) => (
  <LanguageContext.Provider value={lang}>
    <ModalContextProvider>
      <BaseLayout>
        <Head>
          <title>{makeTitle(title, lang)}</title>
        </Head>
        <div className="wcp-article__cover-image-container">
          <img
            className="wcp-article__cover-image"
            src={coverImage.url}
            alt={coverImage.altText}
          />
        </div>
        <FloatingToolbarContainer articleId={articleId} />
        <h1 className="wcp-article__title">{title}</h1>

        {/* eslint-disable-next-line react/no-danger */}
        <p dangerouslySetInnerHTML={{ __html: summary }} />

        <LanguageSelector translations={translations} coverImage={coverImage} />
        {summaryFactCards.map(factCard => (
          <FactCard
            key={factCard.title}
            className="wcp-summary-fact-card"
            cardData={factCard}
          />
        ))}
        <ArticleContent sections={sections} />
      </BaseLayout>

      <ModalContextConsumer>
        {({ registerModal, isModalOpen, modalData, closeModal }) => (
          <ArticleSummaryModalContainer
            registerModal={registerModal}
            isModalOpen={isModalOpen}
            modalData={modalData}
            closeModal={closeModal}
          />
        )}
      </ModalContextConsumer>
      <ShareFactBottomSheetContainer />
    </ModalContextProvider>
  </LanguageContext.Provider>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const articleResponse = await fetch(articleContentUrl(articleId, lang));
  const articleJson = await articleResponse.json();

  return {
    ...articleJson,
    articleId,
    lang
  };
};

Article.defaultProps = {
  summaryFactCards: []
};

Article.propTypes = {
  articleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  summary: PropTypes.string.isRequired,
  sections: sectionsPropTypes.isRequired,
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired,
  summaryFactCards: PropTypes.arrayOf(factCardDataPropTypes)
};

export default Article;
