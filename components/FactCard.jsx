import React from "react";
import PropTypes from "prop-types";

import { IconButton } from "./IconButton";
import { ModalContextConsumer } from "./ModalContext";

import { factCardDataPropTypes } from "../lib/prop_types";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { getImageShareUrl } from "../lib/urls";
import { VerticalTimeline } from "./VerticalTimeline";
import { BarChart } from "./BarChart";
import { SectionTitle } from "./SectionTitle";
import { AvatarList } from "./AvatarList";
import { LargeCardCarousel } from "./LargeCardCarousel";

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
  if (cardData.cardType === "table") {
    return <FactCardTable cardData={cardData} />;
  }

  if (cardData.cardType === "avatar") {
    return <AvatarList cardData={cardData} />;
  }

  if (cardData.cardType === "simple") {
    return <FactCardTextContainer cardData={cardData} />;
  }

  if (cardData.cardType === "vertical_timeline") {
    return <VerticalTimeline cardData={cardData} />;
  }

  if (cardData.cardType === "large_carousel") {
    return <LargeCardCarousel cardData={cardData} />;
  }

  if (cardData.cardType === "bar_chart") {
    return <BarChart cardData={cardData} />;
  }

  return null;
};

FactCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
