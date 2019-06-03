import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { LanguageSelector } from "../components/LanguageSelector";
import { LanguageContext } from "../language_context";
import { FactCard } from "../components/FactCard";
import {
  ModalContextProvider,
  ModalContextConsumer
} from "../components/ModalContext";
import { ArticleSummaryModalContainer } from "../components/ArticleSummaryModalContainer";
import { ShareArticleFloatingToolbarContainer } from "../components/ShareArticleFloatingToolbarContainer";

import { makeArticleTitle } from "../lib/make_title";
import { articleContentUrl } from "../lib/urls";
import { articleUiStrings } from "../lib/ui_strings";
import {
  translationsPropTypes,
  imagePropTypes,
  factCardDataPropTypes
} from "../lib/prop_types";
import { Attributions } from "../components/Attributions";
import { getImageAttributions } from "../lib/image_attributions";
import { ImageAttributionsModalContainer } from "../components/ImageAttributionsModalContainer";
import { CONTINUE_READING_MODAL_ID } from "../lib/modal_ids";
import { Button } from "../components/Button";
import { ContinueReadingModalContainer } from "../components/ContinueReadingModalContainer";
import { HomeButton } from "../components/HomeButton";

const Article = ({
  articleId,
  title,
  lang,
  summary,
  coverImage,
  sections,
  translations,
  imageAttributions,
  wikipediaUrl
}) => (
  <LanguageContext.Provider value={lang}>
    <ModalContextProvider>
      <BaseLayout>
        <Head>
          <title>{makeArticleTitle(title, lang)}</title>
        </Head>
        <div className="wcp-article__cover-image-container">
          <img
            className="wcp-article__cover-image"
            src={coverImage.url}
            alt={coverImage.altText}
          />
        </div>
        <ShareArticleFloatingToolbarContainer articleId={articleId} />
        <section>
          <HomeButton lang={lang} />
          <h1 className="wcp-article__title">{title}</h1>

          {/* eslint-disable-next-line react/no-danger */}
          <p dangerouslySetInnerHTML={{ __html: summary }} />
        </section>

        <LanguageSelector translations={translations} coverImage={coverImage} />
        {sections.map(factCard => {
          if (factCard)
            return (
              <FactCard
                key={factCard.title}
                className="wcp-summary-fact-card"
                cardData={factCard}
              />
            );
          return null;
        })}
        <ModalContextConsumer>
          {({ openModal }) => (
            <Button
              className="wcp-article__button-read-more"
              isInverted
              isFullWidth
              onClick={() =>
                openModal(CONTINUE_READING_MODAL_ID, { wikipediaUrl })
              }
            >
              {articleUiStrings.readOnWikipedia[lang]}
            </Button>
          )}
        </ModalContextConsumer>
        <Attributions attributions={imageAttributions} lang={lang} />
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
            <ImageAttributionsModalContainer
              registerModal={registerModal}
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              modalData={modalData}
            />
            <ContinueReadingModalContainer
              registerModal={registerModal}
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              modalData={modalData}
              lang={lang}
            />
          </>
        )}
      </ModalContextConsumer>
    </ModalContextProvider>
  </LanguageContext.Provider>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const articleResponse = await fetch(articleContentUrl(articleId, lang));
  const articleJson = await articleResponse.json();
  const imageAttributions = getImageAttributions(articleJson);

  // Insert a survey link just before the second last section of each article.
  if (articleJson.sections) {
    articleJson.sections.splice(articleJson.sections.length - 1, 0, {
      lang,
      articleId,
      cardType: "survey_link"
    });
  }

  return {
    ...articleJson,
    articleId,
    lang,
    imageAttributions
  };
};

Article.defaultProps = {
  sections: []
};

Article.propTypes = {
  articleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  wikipediaUrl: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  summary: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired,
  sections: PropTypes.arrayOf(factCardDataPropTypes),
  imageAttributions: PropTypes.arrayOf(imagePropTypes).isRequired
};

export default Article;
