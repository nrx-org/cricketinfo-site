import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { imagePropTypes } from "../lib/prop_types";
import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { getImageShareUrl } from "../lib/urls";

export const LargeCard = ({ id, href, coverImage, children, className }) => (
  <ModalContextConsumer>
    {({ openModal }) => (
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
            <IconButton
              onClick={() =>
                openModal(SHARE_MODAL_ID, {
                  text: "hi",
                  url: getImageShareUrl(window.location.href, `#${id}`)
                })
              }
              altText="Share button"
              name="share"
            />
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
    )}
  </ModalContextConsumer>
);

LargeCard.defaultProps = {
  href: "",
  className: ""
};

LargeCard.propTypes = {
  id: PropTypes.string.isRequired,
  href: PropTypes.string,
  coverImage: imagePropTypes.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
