import React from "react";
import PropTypes from "prop-types";
import slugify from "slugify";

import { IconButton } from "./IconButton";
import { ModalContextConsumer } from "./ModalContext";

import { factCardDataPropTypes } from "../lib/prop_types";
import { ARTICLE_SUMMARY_MODAL_ID, SHARE_MODAL_ID } from "../lib/modal_ids";
import { getImageShareUrl } from "../lib/urls";
import { VerticalTimeline } from "./VerticalTimeline";
import { SectionTitle } from "./SectionTitle";

const FactCardTable = ({ cardData }) => {
  const content = cardData.facts.map(f => (
    <tr key={f.label}>
      <th>{f.label}</th>
      <td>
        {f.value.url ? (
          <a href={f.value.url}>{f.value.label}</a>
        ) : (
          f.value.label
        )}
      </td>
    </tr>
  ));
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>
      <table className="wcp-fact-card-table-content">
        <tbody>{content}</tbody>
      </table>
    </section>
  );
};

FactCardTable.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const FactCardImageList = ({ cardData }) => (
  <section className="wcp-fact-card-image-list">
    <SectionTitle>{cardData.title}</SectionTitle>
    {cardData.summary && (
      <p className="wcp-fact-card-image-list__summary">{cardData.summary}</p>
    )}
    <div className="wcp-fact-card-image-list__item-list-wrapper">
      {cardData.facts.map(f => {
        const content = (
          <div className="wcp-fact-card-image-list__item">
            <div className="wcp-fact-card-image-list__item__profile-picture">
              <img src={f.value.image.url} alt={f.value.image.alt} />
            </div>
            <div className="wcp-fact-card-image-list__item__info">
              <div className="wcp-fact-card-image-list__item__info__label">
                {f.label}
              </div>
              <div className="wcp-fact-card-image-list__item__info__value font-family-heading">
                {f.value.label}
              </div>
            </div>
          </div>
        );

        return f.value.url ? (
          <ModalContextConsumer key={`${f.label}-${f.value.label}`}>
            {({ openModal }) => (
              <a
                className="wcp-fact-card-image-list__item-wrapper"
                href={f.value.url}
                onClick={e => {
                  e.preventDefault();
                  openModal(ARTICLE_SUMMARY_MODAL_ID, {
                    articleId: slugify(f.value.label, "_")
                  });
                }}
              >
                {content}
              </a>
            )}
          </ModalContextConsumer>
        ) : (
          <div className="wcp-fact-card-image-list__item-wrapper">content</div>
        );
      })}
    </div>
  </section>
);

FactCardImageList.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const FactCardTextContainer = props => {
  return (
    <ModalContextConsumer>
      {({ openModal }) => <FactCardText {...props} openModal={openModal} />}
    </ModalContextConsumer>
  );
};

const FactCardText = ({ cardData, openModal }) => {
  const share = () => {
    const shareUrl = getImageShareUrl(window.location.href, `#${cardData.id}`);
    if (navigator.share) {
      navigator.share({
        title: cardData.title,
        url: shareUrl
      });
    } else {
      openModal(SHARE_MODAL_ID, {
        text: cardData.url,
        url: shareUrl
      });
    }
  };

  return (
    <section className="wcp-fact-card-text">
      <SectionTitle>{cardData.title}</SectionTitle>
      <p className="wcp-fact-card-text__text">
        {cardData.facts[0].value.label}
      </p>
      <div className="wcp-fact-card-text__icon">
        <IconButton onClick={share} name="share" altText="Share Icon" />
      </div>
    </section>
  );
};

FactCardText.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  openModal: PropTypes.func.isRequired
};

export const FactCard = ({ cardData }) => {
  let content = null;
  if (cardData.cardType === "table") {
    content = <FactCardTable cardData={cardData} />;
  } else if (cardData.cardType === "avatar") {
    content = <FactCardImageList cardData={cardData} />;
  } else if (cardData.cardType === "simple") {
    content = <FactCardTextContainer cardData={cardData} />;
  } else if (cardData.cardType === "vertical_timeline") {
    content = <VerticalTimeline cardData={cardData} />;
  }

  return content;
};

FactCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
