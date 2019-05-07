import React from "react";
import PropTypes from "prop-types";

import { Icon } from "./Icon";

import { imagePropTypes } from "../lib/prop_types";

export const LargeCard = ({
  url,
  title,
  coverImage,
  linkText,
  children,
  isCarouselChild
}) => {
  return (
    <a
      href={url}
      className={`wcp-large-card ${
        isCarouselChild ? "wcp-large-card--carousel-child" : ""
      }`}
    >
      <img
        className="wcp-large-card__cover-image"
        src={coverImage.url}
        alt={coverImage.altText}
      />
      <section className="wcp-large-card__content">
        <h1 className="wcp-large-card__content__title">{title}</h1>
        {children && (
          <div className="wcp-large-card__content__text">{children}</div>
        )}

        {/* eslint-disable react/jsx-one-expression-per-line */}
        {linkText && (
          <span className="wcp-large-card__link-text">
            {linkText}{" "}
            <Icon
              className="wcp-large-card__link-text__icon"
              altText="Go to language"
              name="arrow_right"
              size="xs"
            />
          </span>
        )}
      </section>
    </a>
  );
};

LargeCard.defaultProps = {
  children: null,
  linkText: null,
  isCarouselChild: false
};

LargeCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  linkText: PropTypes.string,
  children: PropTypes.node,
  isCarouselChild: PropTypes.bool
};
