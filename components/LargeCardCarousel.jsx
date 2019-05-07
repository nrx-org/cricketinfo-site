import React from "react";
import PropTypes from "prop-types";
import { LargeCard } from "./LargeCard";
import { factPropTypes } from "../lib/prop_types";

export const LargeCardCarousel = ({ cards }) => (
  <div className="wcp-large-card-carousel">
    {cards.map(card => (
      <LargeCard
        isCarouselChild={cards.length > 2}
        key={`${card.label}-${card.id}`}
        coverImage={card.value.image}
        title={card.label}
        url={card.value.url || null}
      >
        {card.value.label}
      </LargeCard>
    ))}
  </div>
);

LargeCardCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired
};
