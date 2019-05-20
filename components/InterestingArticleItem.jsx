import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";

export const InterestingArticleItem = ({ coverImage, href, styles }) => {
  const unit = "rem";

  const stylesWithUnits = {
    width: styles.width + unit,
    height: styles.height + unit,
    left: styles.left + unit,
    top: styles.top + unit
  };
  const contentEl = (
    <div className="wcp-circular-image-card">
      <img
        className="wcp-circular-image-card__cover-image"
        src={coverImage.url}
        alt={coverImage.altText}
      />
    </div>
  );
  return href ? (
    <a
      className="wcp-circular-image-card-wrapper"
      style={stylesWithUnits}
      href={href}
    >
      {contentEl}
    </a>
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