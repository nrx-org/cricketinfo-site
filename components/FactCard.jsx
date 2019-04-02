import React from "react";
import PropTypes from "prop-types";

import { Card } from "./Card";
import { factCardDataPropTypes } from "../lib/prop_types";

const SimpleContent = ({ cardData }) => {
  const content = cardData.facts.map(f => (
    <tr>
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
    <table className="wcp-fact-card__table">
      <tbody>{content}</tbody>
    </table>
  );
};

SimpleContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const AvatarContent = ({ cardData }) => (
  <div className="wcp-avatar-content">
    {cardData.facts.map(f => {
      const content = (
        <div className="wcp-avatar-content__item">
          <div className="wcp-avatar-content__item__profile-picture">
            <img src={f.value.image.url} alt={f.value.image.alt} />
          </div>
          <div className="wcp-avatar-content__item__info">
            <div className="wcp-avatar-content__item__info__label">
              {f.label}
            </div>
            <div className="wcp-avatar-content__item__info__value">
              {f.value.label}
            </div>
          </div>
        </div>
      );

      return f.value.url ? <a href={f.value.url}>{content}</a> : content;
    })}
  </div>
);

AvatarContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const NestedContent = ({ cardData }) => {
  return (
    <div className="wcp-nested-content">
      {cardData.facts.map(f => {
        const card = (
          <Card
            shadowSize="s"
            title={f.value.label}
            coverImage={f.value.image}
            className="wcp-nested-content__card"
            imagePosition="left"
          />
        );
        return (
          <div className="wcp-nested-content__item">
            <div className="wcp-nested-content__item__label">{f.label}</div>
            {f.value.url ? <a href={f.value.url}>{card}</a> : card}
          </div>
        );
      })}
    </div>
  );
};

NestedContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

export const FactCard = ({ cardData, className }) => {
  let content = null;
  if (cardData.cardType === "simple") {
    content = <SimpleContent cardData={cardData} />;
  } else if (cardData.cardType === "avatar") {
    content = <AvatarContent cardData={cardData} />;
  } else if (cardData.cardType === "nested") {
    content = <NestedContent cardData={cardData} />;
  }

  return (
    <Card
      className={`wcp-fact-card ${className}`}
      title={cardData.title}
      contentClassName="wcp-fact-card__content"
    >
      {content}
    </Card>
  );
};

FactCard.defaultProps = {
  className: ""
};

FactCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  className: PropTypes.string
};
