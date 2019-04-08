import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";
import { Button } from "./Button";

export const ArticleSummaryModal = ({
  isLoadingArticle,
  article,
  onCloseClick
}) => {
  if (!article) {
    return null;
  }

  if (isLoadingArticle) {
    return <p>Loading...</p>;
  }

  return (
    <div className="wcp-article-summary-modal">
      <div className="wcp-article-summary-modal__cover-image-container">
        <img
          className="wcp-article-summary-modal__cover-image"
          src={article.coverImage.url}
          alt={article.coverImage.altText}
        />
      </div>
      <div className="wcp-article-summary-modal__content">
        <h1 className="wcp-article-summary-modal__title">{article.title}</h1>
        <p className="wcp-article-summary-modal__summary">{article.summary}</p>
        <Button
          className="wcp-article-summary-modal__button-read-article"
          type="inverted"
        >
          Read This Article
        </Button>
      </div>
    </div>
  );
};

ArticleSummaryModal.defaultProps = {
  article: null
};

ArticleSummaryModal.propTypes = {
  isLoadingArticle: PropTypes.bool.isRequired,
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    coverImage: imagePropTypes.isRequired
  }),
  onCloseClick: PropTypes.func.isRequired
};
