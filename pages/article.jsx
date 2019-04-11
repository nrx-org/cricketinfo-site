import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { ArticleContent } from "../components/ArticleContent";
import { makeTitle } from "../lib/make_title";
import { articleContentUrl, getTranslationUrl } from "../lib/urls";
import {
  sectionsPropTypes,
  translationsPropTypes,
  imagePropTypes,
  factCardDataPropTypes
} from "../lib/prop_types";
import { LanguageSelector } from "../components/LanguageSelector";
import { LanguageContextProvider } from "../language_context";
import { FactCard } from "../components/FactCard";
import {
  ModalContextProvider,
  ModalContextConsumer
} from "../components/ModalContext";
import { ArticleSummaryModalContainer } from "../components/ArticleSummaryModalContainer";

const Article = ({
  title,
  sections,
  summary,
  coverImage,
  summaryFactCards,
  translations,
  i18n
}) => (
  <LanguageContextProvider lang={i18n.lang} translations={i18n.translations}>
    <ModalContextProvider>
      <BaseLayout>
        <Head>
          <title>{makeTitle(title, i18n.lang)}</title>
        </Head>
        <div className="wcp-article__cover-image-container">
          <img
            className="wcp-article__cover-image"
            src={coverImage.url}
            alt={coverImage.altText}
          />
        </div>
        <h1>{title}</h1>

        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: summary }} />

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
          <>
            <ArticleSummaryModalContainer
              registerModal={registerModal}
              isModalOpen={isModalOpen}
              modalData={modalData}
              closeModal={closeModal}
            />
          </>
        )}
      </ModalContextConsumer>
    </ModalContextProvider>
  </LanguageContextProvider>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const articleResponse = await fetch(articleContentUrl(articleId, lang));
  const articleJson = await articleResponse.json();

  const translationResponse = await fetch(getTranslationUrl(lang));
  const translationJson = await translationResponse.json();

  return {
    ...articleJson,
    i18n: {
      lang,
      translations: translationJson
    }
  };
};

Article.defaultProps = {
  summaryFactCards: []
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  summary: PropTypes.string.isRequired,
  sections: sectionsPropTypes.isRequired,
  translations: translationsPropTypes.isRequired,
  summaryFactCards: PropTypes.arrayOf(factCardDataPropTypes),
  i18n: PropTypes.shape({
    lang: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired
  }).isRequired
};

export default Article;
