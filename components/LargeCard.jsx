import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { imagePropTypes } from "../lib/prop_types";

export const LargeCard = ({ href, coverImage, children, className }) => (
  <section className={`wcp-large-card ${className}`}>
    <div className="wcp-large-card__cover-image__container">
      <img
        className="wcp-large-card__cover-image"
        src={coverImage.url}
        alt={coverImage.altText}
      />
    </div>
    <div className="wcp-large-card__content">
      <div className="wcp-large-card__children wcp-font-family-heading">
        {children}
      </div>
      <div className="wcp-large-card__controls">
        <IconButton onClick={() => {}} altText="Share button" name="share" />
        {href ? (
          <Button
            className="wcp-large-card__controls__button-read-more"
            href={href}
            isInverted
            isFullWidth={false}
            paddingSize="s"
          >
            Read
          </Button>
        ) : null}
      </div>
    </div>
  </section>
);

LargeCard.defaultProps = {
  href: "",
  className: ""
};

LargeCard.propTypes = {
  href: PropTypes.string,
  coverImage: imagePropTypes.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
