import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";
import { articleUrl } from "../lib/urls";
import { LanguageContext } from "../language_context";

import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { ERROR_NOT_FOUND, ERROR_NETWORK } from "../lib/errors";

const RETRY_TEXT = {
  en: "Retry",
  hi: "TODO"
};

const NOT_FOUND_TEXT = {
  en: "This page could not be found",
  hi: "TODO"
};

const NETWORK_ERROR_TEXT = {
  en: "There was a network error. Please try again.",
  hi: "TODO"
};

const READ_THIS_TEXT = {
  en: "Read this article",
  hi: "TODO"
};

export const ArticleSummaryModal = props => (
  <LanguageContext.Consumer>
    {lang => <ArticleSummaryModalInternal lang={lang} {...props} />}
  </LanguageContext.Consumer>
);

const ArticleSummaryModalInternal = ({
  isLoading,
  article,
  onCloseClick,
  error,
  onRetry,
  lang,
  articleSlug
}) => {
  if (error) {
    const message =
      error === ERROR_NOT_FOUND
        ? NOT_FOUND_TEXT[lang]
        : NETWORK_ERROR_TEXT[lang];

    return (
      <div className="wcp-article-summary-modal__error">
        <p>{message}</p>
        <Button
          isInverted
          onClick={onCloseClick}
          className="wcp-article-summary-modal__error__button-close"
        >
          Close
        </Button>
        {error === ERROR_NETWORK && (
          <Button onClick={onRetry}>{RETRY_TEXT[lang]}</Button>
        )}
      </div>
    );
  }

  if (!article) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wcp-article-summary-modal">
      <div className="wcp-article-summary-modal__cover-image-container">
        {article.coverImage ? (
          <img
            className="wcp-article-summary-modal__cover-image"
            src={article.coverImage.url}
            alt={article.coverImage.altText}
          />
        ) : null}
        <IconButton
          name="close"
          className="wcp-article-summary-modal__icon-close"
          altText="Close"
          onClick={onCloseClick}
          size="l"
        />
      </div>
      <div className="wcp-article-summary-modal__content">
        <h1 className="wcp-article-summary-modal__title">{article.title}</h1>
        <p className="wcp-article-summary-modal__summary">{article.summary}</p>
        {article.sections && article.sections.length > 0 ? (
          <Button
            className="wcp-article-summary-modal__button-read-article"
            isInverted
            href={articleUrl(articleSlug, lang)}
          >
            {READ_THIS_TEXT[lang]}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

ArticleSummaryModalInternal.defaultProps = {
  article: null,
  error: null
};

ArticleSummaryModalInternal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    coverImage: imagePropTypes
  }),
  articleSlug: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired
};
