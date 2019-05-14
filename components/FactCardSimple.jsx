import React from "react";
import PropTypes from "prop-types";

import { IconButton } from "./IconButton";
import { SectionTitle } from "./SectionTitle";

import { ModalContextConsumer } from "./ModalContext";
import { factCardDataPropTypes } from "../lib/prop_types";
import { getImageShareUrl } from "../lib/urls";
import { SHARE_MODAL_ID } from "../lib/modal_ids";

const FactCardSimpleContents = ({ cardData, openModal }) => {
  const share = () => {
    const shareUrl = getImageShareUrl(cardData.facts[0].url, `#${cardData.id}`);
    if (navigator.share) {
      navigator.share({
        title: cardData.title,
        url: shareUrl
      });
    } else {
      openModal(SHARE_MODAL_ID, {
        text: cardData.facts[0].value.label,
        url: shareUrl
      });
    }
  };

  return (
    <section className="wcp-fact-card-simple" id={cardData.id}>
      <SectionTitle>{cardData.title}</SectionTitle>
      <div className="wcp-fact-card-simple__content-wrapper">
        <div
          className="wcp-fact-card-simple__image"
          style={{
            backgroundImage: `url(${cardData.facts[0].value.image.url})`
          }}
        />
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
  openModal: PropTypes.func.isRequired
};

export const FactCardSimple = props => {
  return (
    <ModalContextConsumer>
      {({ openModal }) => (
        <FactCardSimpleContents {...props} openModal={openModal} />
      )}
    </ModalContextConsumer>
  );
};
