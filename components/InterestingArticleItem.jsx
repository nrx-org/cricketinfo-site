import React from "react";
import PropTypes from "prop-types";
import { Image, Transformation } from "cloudinary-react";
import { useTracking } from "react-tracking";

import ArticleSummaryLink from "./ArticleSummaryLink";
import { CLICK_INTERESTING_ARTICLE } from "../lib/matomo";
import { imagePropTypes } from "../lib/prop_types";
import { CLOUDINARY_CLOUD_NAME } from "../lib/urls";

export const InterestingArticleItem = ({ coverImage, href, styles }) => {
  const tracking = useTracking();
  const unit = "rem";

  const stylesWithUnits = {
    width: styles.width + unit,
    height: styles.height + unit,
    left: styles.left + unit,
    top: styles.top + unit
  };
  const contentEl =
    process.env.NODE_ENV === "production" ? (
      <Image
        cloudName={CLOUDINARY_CLOUD_NAME}
        secure="true"
        publicId={coverImage.url.slice(1)}
        alt={coverImage.altText}
        className="wcp-circular-image-card"
      >
        <Transformation
          quality="auto:good"
          width="96"
          crop="scale"
          fetchFormat="auto"
        />
      </Image>
    ) : (
      <img
        src={coverImage.url}
        alt={coverImage.altText}
        className="wcp-circular-image-card"
      />
    );
  return href ? (
    <ArticleSummaryLink
      className="wcp-circular-image-card-wrapper"
      styles={stylesWithUnits}
      href={href}
      onClick={() => {
        tracking.trackEvent(CLICK_INTERESTING_ARTICLE(href));
      }}
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
