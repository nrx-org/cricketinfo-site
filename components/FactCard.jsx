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

const AvatarContent = ({ cardData }) => null;

AvatarContent.propTypes = {
  cardData: factCardDataPropTypes
};

const NestedContent = ({ cardData }) => null;

NestedContent.propTypes = {
  cardData: factCardDataPropTypes
};

export const FactCard = ({ cardData, className }) => {
  let content = null;
  if (cardData.cardType === "simple") {
    content = <SimpleContent cardData={cardData} />;
  } else if (cardData.type === "avatar") {
    content = <AvatarContent cardData={cardData} />;
  } else if (cardData.type === "nested") {
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
