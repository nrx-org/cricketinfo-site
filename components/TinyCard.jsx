import React from "react";
import PropTypes from "prop-types";
import { useTracking } from "react-tracking";
import { CLICK_TINY_CARD } from "../lib/matomo";
import ArticleSummaryLink from "./ArticleSummaryLink";
import { imagePropTypes } from "../lib/prop_types";
import { Image } from "./Image";

export const TinyCard = ({ children, coverImage, title, href }) => {
  const tracking = useTracking();
  const activeClassName = href
    ? "wcp-tiny-card--active"
    : "wcp-tiny-card--passive";

  const contentEl = (
    <div className={`wcp-tiny-card ${activeClassName}`}>
      <Image
        className="wcp-tiny-card__cover-image"
        src={coverImage.url}
        alt={coverImage.altText}
      />
      <section className="wcp-tiny-card__content">
        {title && <h1 className="wcp-tiny-card__title">{title}</h1>}
        <div className="wcp-tiny-card__text">{children}</div>
      </section>
    </div>
  );

  return href ? (
    <ArticleSummaryLink
      className={`wcp-tiny-card-wrapper ${activeClassName}`}
      href={href}
      onClick={() => {
        tracking.trackEvent(CLICK_TINY_CARD(title));
      }}
    >
      {contentEl}
    </ArticleSummaryLink>
  ) : (
    <div className={`wcp-tiny-card-wrapper ${activeClassName}`}>
      {contentEl}
    </div>
  );
};

TinyCard.defaultProps = {
  children: null,
  coverImage: null,
  title: null,
  href: null
};

TinyCard.propTypes = {
  children: PropTypes.node,
  coverImage: imagePropTypes,
  title: PropTypes.string,
  href: PropTypes.string
};
