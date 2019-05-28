import React from "react";
import PropTypes from "prop-types";
import { TinyCard } from "./TinyCard";
import { factPropTypes } from "../lib/prop_types";

export const TinyCardCarousel = ({ cards }) => {
  if (!cards) {
    return null;
  }

  return (
    <div className="wcp-tiny-card-carousel">
      {cards.map(card => (
        <TinyCard
          key={`${card.label}-${card.id}`}
          coverImage={card.value.image}
          title={card.label}
          href={card.url || null}
        >
          {card.value.label}
        </TinyCard>
      ))}
    </div>
  );
};

TinyCardCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired
};
