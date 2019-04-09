import React from "react";
import PropTypes from "prop-types";
import slugify from "slugify";

import { imagePropTypes } from "../lib/prop_types";
import { articleUrl } from "../lib/urls";
import { LanguageContext } from "../language_context";

import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { LoadingSpinner } from "./LoadingSpinner";

export const ArticleSummaryModal = ({
  isLoadingArticle,
  article,
  onCloseClick,
  error
}) => {
  if (error && error === ERROR_NOT_FOUND) {
    return (
      <div>
        <p>This page could not be found.</p>
        <Button>Close</Button>
      </div>
    );
  }

  if (error && error === ERROR_NETWORK) {
    return (
      <div>
        <p>There is a network error</p>
        <Button>Retry</Button>
        <Button>Close</Button>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  if (isLoadingArticle) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wcp-article-summary-modal">
      <div className="wcp-article-summary-modal__cover-image-container">
        <img
          className="wcp-article-summary-modal__cover-image"
          src={article.coverImage.url}
          alt={article.coverImage.altText}
        />
        <IconButton
          name="close"
          className="wcp-article-summary-modal__icon-close"
          altText="Close"
          onClick={onCloseClick}
        />
      </div>
      <div className="wcp-article-summary-modal__content">
        <h1 className="wcp-article-summary-modal__title">{article.title}</h1>
        <p className="wcp-article-summary-modal__summary">{article.summary}</p>
        <LanguageContext.Consumer>
          {lang => (
            <Button
              className="wcp-article-summary-modal__button-read-article"
              type="inverted"
              isLink
              href={articleUrl(slugify(article.title, "_"), lang)}
            >
              Read This Article
            </Button>
          )}
        </LanguageContext.Consumer>
      </div>
    </div>
  );
};

ArticleSummaryModal.defaultProps = {
  article: null,
  error: null
};

ArticleSummaryModal.propTypes = {
  isLoadingArticle: PropTypes.bool.isRequired,
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    coverImage: imagePropTypes.isRequired
  }),
  onCloseClick: PropTypes.func.isRequired,
  error: PropTypes.string
};
