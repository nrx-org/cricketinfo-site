import React from "react";
import PropTypes from "prop-types";
import { useTracking } from "react-tracking";
import * as cogoToast from "cogo-toast";
import { SHARE_FLAT_CARD, SHARE_FLAT_CARD_LINK_ERROR } from "../lib/matomo";

import { IconButton } from "./IconButton";
import { SectionTitle } from "./SectionTitle";

import { ModalContextConsumer } from "./ModalContext";
import { factCardDataPropTypes } from "../lib/prop_types";
import { getCloudinaryUrl, getImageShareApiUrl } from "../lib/urls";
import { LOADING_SPINNER_MODAL_ID, SHARE_MODAL_ID } from "../lib/modal_ids";
import { articleUiStrings } from "../lib/ui_strings";

const FactCardSimpleContents = ({ cardData, openModal, closeModal }) => {
  const tracking = useTracking();

  const share = async () => {
    tracking.trackEvent(SHARE_FLAT_CARD(cardData.facts[0].label));
    openModal(LOADING_SPINNER_MODAL_ID);

    let shareUrlResponse = null;
    try {
      shareUrlResponse = await fetch(
        getImageShareApiUrl(window.location.href, `#${cardData.id}`)
      );
    } catch (e) {
      cogoToast.error(articleUiStrings.shareLinkError, {
        bar: {
          size: "0px"
        }
      });
      closeModal(LOADING_SPINNER_MODAL_ID);
      tracking.trackEvent(SHARE_FLAT_CARD_LINK_ERROR());
      return;
    }

    let shareUrlJson = null;

    try {
      shareUrlJson = await shareUrlResponse.json();
    } catch (e) {
      cogoToast.error(articleUiStrings.shareLinkError, {
        bar: {
          size: "0px"
        }
      });
      closeModal(LOADING_SPINNER_MODAL_ID);
      tracking.trackEvent(SHARE_FLAT_CARD_LINK_ERROR());
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: cardData.title,
        url: shareUrlJson.shareUrl
      });
    } else {
      openModal(SHARE_MODAL_ID, {
        text: cardData.facts[0].value.label,
        url: shareUrlJson.shareUrl
      });
    }
  };

  const cloudinaryUrl = getCloudinaryUrl(cardData.facts[0].value.image.url);

  return (
    <section className="wcp-fact-card-simple">
      <SectionTitle>{cardData.title}</SectionTitle>
      <div className="wcp-fact-card-simple__content-wrapper" id={cardData.id}>
        {cardData.facts[0].value.image ? (
          <div
            className="wcp-fact-card-simple__image"
            style={{
              backgroundImage: `url(${cloudinaryUrl})`
            }}
          />
        ) : null}
        <div className="wcp-fact-card-simple__text-section">
          <h4 className="wcp-fact-card-simple__text-section__title">
            {cardData.facts[0].label}
          </h4>
          <p className="wcp-fact-card-simple__text-section__caption">
            {cardData.facts[0].value.label}
          </p>
          <div className="wcp-fact-card-simple__text-section__icon">
            <IconButton
              onClick={share}
              name="share-white"
              altText="Share Icon"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

FactCardSimpleContents.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

export const FactCardSimple = props => {
  return (
    <ModalContextConsumer>
      {({ openModal, closeModal }) => (
        <FactCardSimpleContents
          {...props}
          openModal={openModal}
          closeModal={closeModal}
        />
      )}
    </ModalContextConsumer>
  );
};
