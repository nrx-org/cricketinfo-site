import React from "react";
import PropTypes from "prop-types";

import { Card } from "./Card";
import { Icon } from "./Icon";

import { factCardDataPropTypes } from "../lib/prop_types";

const TableContent = ({ cardData }) => {
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
    <table className="wcp-fact-card__table-content ">
      <tbody>{content}</tbody>
    </table>
  );
};

TableContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const AvatarContent = ({ cardData }) => (
  <div className="wcp-fact-card__avatar-content">
    {cardData.facts.map(f => {
      const content = (
        <div className="wcp-fact-card__avatar-content__item">
          <div className="wcp-fact-card__avatar-content__item__profile-picture">
            <img src={f.value.image.url} alt={f.value.image.alt} />
          </div>
          <div className="wcp-fact-card__avatar-content__item__info">
            <div className="wcp-fact-card__avatar-content__item__info__label">
              {f.label}
            </div>
            <div className="wcp-fact-card__avatar-content__item__info__value">
              {f.value.label}
            </div>
          </div>
        </div>
      );

      return f.value.url ? (
        <a
          className="wcp-fact-card__avatar-content__item-wrapper"
          href={f.value.url}
        >
          {content}
        </a>
      ) : (
        <div className="wcp-fact-card__avatar-content__item-wrapper">
          content
        </div>
      );
    })}
  </div>
);

AvatarContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

const NestedContent = ({ cardData }) => {
  return (
    <div className="wcp-fact-card__nested-content">
      {cardData.facts.map(f => {
        const card = (
          <Card
            shadowSize="s"
            title={f.value.label}
            titleClassName="wcp-fact-card__nested-content__title"
            coverImage={f.value.image}
            className="wcp-fact-card__nested-content__item__card"
            imagePosition="left"
          />
        );
        return (
          <div className="wcp-fact-card__nested-content__item">
            <div className="wcp-fact-card__nested-content__item__label">
              {f.label}
            </div>
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

const SimpleContent = ({ cardData }) => {
  return (
    <div className="wcp-fact-card__simple-content">
      <p className="wcp-fact-card__simple-content__text">
        {cardData.facts[0].value.label}
      </p>
      <div className="wcp-fact-card__simple-content__icon">
        <Icon name="share" altText="Share Icon" />
      </div>
    </div>
  );
};

SimpleContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

export const FactCard = ({ cardData, className }) => {
  let content = null;
  if (cardData.cardType === "table") {
    content = <TableContent cardData={cardData} />;
  } else if (cardData.cardType === "avatar") {
    content = <AvatarContent cardData={cardData} />;
  } else if (cardData.cardType === "nested") {
    content = <NestedContent cardData={cardData} />;
  } else if (cardData.cardType === "simple") {
    content = <SimpleContent cardData={cardData} />;
  }

  return (
    <Card
      className={`wcp-fact-card ${className}`}
      title={cardData.title}
      titleClassName="wcp-fact-card__title"
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
