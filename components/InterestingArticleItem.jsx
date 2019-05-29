import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";

import ArticleSummaryLink from "./ArticleSummaryLink";

export const InterestingArticleItem = ({ coverImage, href, styles }) => {
  const unit = "rem";

  const stylesWithUnits = {
    width: styles.width + unit,
    height: styles.height + unit,
    left: styles.left + unit,
    top: styles.top + unit
  };
  const contentEl = (
    <div className="wcp-circular-image-card" style={{ backgroundImage: `url(${coverImage.url})` }}
    title={coverImage.altText}>

    </div>
  );
  return href ? (
    <ArticleSummaryLink
      className="wcp-circular-image-card-wrapper"
      styles={stylesWithUnits}
      href={href}
    >
      {contentEl}
    </ArticleSummaryLink>
  ) : (
    <div className="wcp-circular-image-card-wrapper" style={stylesWithUnits}>
      {contentEl}
    </div>
  );
};

InterestingArticleItem.defaultProps = {
  coverImage: null,
  href: null
};

InterestingArticleItem.propTypes = {
  coverImage: imagePropTypes,
  href: PropTypes.string,
  styles: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};
