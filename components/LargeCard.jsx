import React from "react";
import PropTypes from "prop-types";
import { useTracking } from "react-tracking";
import {
  CLICK_SHARE_LARGE_CARD,
  CLICK_KNOW_MORE_LARGE_CARD
} from "../lib/matomo";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { imagePropTypes } from "../lib/prop_types";
import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { getImageShareUrl } from "../lib/urls";

const shareCard = (shareData, openModal) => {
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    openModal(SHARE_MODAL_ID, shareData);
  }
};

export const LargeCard = ({
  id,
  href,
  coverImage,
  title,
  caption,
  className,
  cardOrientation,
  buttonText
}) => {
  const tracking = useTracking();

  return (
    <ModalContextConsumer>
      {({ openModal }) => (
        <div className="wcp-large-card-wrapper">
          <section
            id={id}
            className={`wcp-large-card ${className} wcp-large-card--${cardOrientation}`}
          >
            <div className="wcp-large-card__cover-image__container">
              <img
                className="wcp-large-card__cover-image"
                src={coverImage.url}
                alt={coverImage.altText}
              />
            </div>
            <div className="wcp-large-card__content">
              {cardOrientation === "horizontal" ? (
                <div className="wcp-large-card__children wcp-font-family-heading">
                  <p>{title}</p>
                </div>
              ) : (
                <div>
                  <h2 className="wcp-large-card__label">{title}</h2>
                  <div className="wcp-large-card__caption">{caption}</div>
                </div>
              )}
              <div className="wcp-large-card__controls">
                <IconButton
                  onClick={() => {
                    tracking.trackEvent(CLICK_SHARE_LARGE_CARD(title));
                    shareCard(
                      {
                        title,
                        url: getImageShareUrl(window.location.href, `#${id}`)
                      },
                      openModal
                    );
                  }}
                  altText="Share button"
                  name="share"
                />
                {href ? (
                  <Button
                    className="wcp-large-card__controls__button-read-more"
                    href={href}
                    onClick={event => {
                      event.preventDefault();
                      tracking.trackEvent(CLICK_KNOW_MORE_LARGE_CARD(title));
                      if (href) {
                        if (href.indexOf("http") > -1)
                          window.location.url = href;
                        else window.location.pathname = href;
                      }
                    }}
                    isInverted
                    isFullWidth={false}
                    paddingSize="s"
                  >
                    {buttonText}
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      )}
    </ModalContextConsumer>
  );
};

LargeCard.defaultProps = {
  href: "",
  className: "",
  cardOrientation: "horizontal",
  buttonText: "Know More",
  title: "",
  caption: ""
};

LargeCard.propTypes = {
  id: PropTypes.string.isRequired,
  href: PropTypes.string,
  coverImage: imagePropTypes.isRequired,
  title: PropTypes.string,
  caption: PropTypes.string,
  className: PropTypes.string,
  cardOrientation: PropTypes.string, // horizontal, vertical
  buttonText: PropTypes.string
};
