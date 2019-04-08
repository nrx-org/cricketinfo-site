import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";

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
    <div>
      <div className="wcp-article-summary-modal__cover-image-container">
        <img
          className="wcp-article-summary-modal__cover-image"
          src={article.coverImage.url}
          alt={article.coverImage.altText}
        />
      </div>
      <h1>{article.title}</h1>
      <p>{article.summary}</p>
      <button type="button" onClick={onCloseClick}>
        Close
      </button>
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
