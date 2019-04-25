import React from "react";
import PropTypes from "prop-types";
import slugify from "slugify";

import { Card } from "./Card";
import { IconButton } from "./IconButton";
import { ModalContextConsumer } from "./ModalContext";

import { factCardDataPropTypes } from "../lib/prop_types";
import {
  ARTICLE_SUMMARY_MODAL_ID,
  SHARE_FACT_CARD_BOTTOM_SHEET_ID
} from "../lib/modal_ids";
import { getImageShareUrl } from "../lib/urls";
import { VerticalTimelineContent } from "./VerticalTimelineContent";

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
      <h1>{cardData.title}</h1>
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
    <h1>{cardData.title}</h1>
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
            <div className="wcp-fact-card-image-list__item__info__value">
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
  </section>
);

FactCardImageList.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const FactCardKeyedImageList = ({ cardData }) => {
  return (
    <section className="wcp-fact-card-keyed-image-list">
      <h1>{cardData.title}</h1>
      {cardData.facts.map(f => {
        const card = (
          <Card
            shadowSize="s"
            title={f.value.label}
            titleClassName="wcp-fact-card-keyed-image-list__title"
            coverImage={f.value.image}
            className="wcp-fact-card-keyed-image-list__item__card"
            imagePosition="left"
          />
        );
        return (
          <div
            key={`${f.label}-${f.value.label}`}
            className="wcp-fact-card-keyed-image-list__item"
          >
            <div className="wcp-fact-card-keyed-image-list__item__label">
              {f.label}
            </div>
            {f.value.url ? <a href={f.value.url}>{card}</a> : card}
          </div>
        );
      })}
    </section>
  );
};

FactCardKeyedImageList.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const FactCardTextContainer = props => {
  return (
    <ModalContextConsumer>
      {({ openModal }) => (
        <FactCardText
          {...props}
          openShareSheet={shareUrl =>
            openModal(SHARE_FACT_CARD_BOTTOM_SHEET_ID, { shareUrl })
          }
        />
      )}
    </ModalContextConsumer>
  );
};

const FactCardText = ({ cardData, openShareSheet }) => {
  const share = () => {
    const shareUrl = getImageShareUrl(window.location.href, `#${cardData.id}`);
    if (navigator.share) {
      navigator.share({
        title: cardData.title,
        url: shareUrl
      });
    } else {
      openShareSheet(shareUrl);
    }
  };

  return (
    <section className="wcp-fact-card-text">
      <h1>{cardData.title}</h1>
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
  openShareSheet: PropTypes.func.isRequired
};

export const FactCard = ({ cardData }) => {
  let content = null;
  if (cardData.cardType === "table") {
    content = <FactCardTable cardData={cardData} />;
  } else if (cardData.cardType === "avatar") {
    content = <FactCardImageList cardData={cardData} />;
  } else if (cardData.cardType === "nested") {
    content = <FactCardKeyedImageList cardData={cardData} />;
  } else if (cardData.cardType === "simple") {
    content = <FactCardTextContainer cardData={cardData} />;
  } else if (cardData.cardType === "vertical_timeline") {
    content = <VerticalTimelineContent cardData={cardData} />;
  }

  return content;
};

FactCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
