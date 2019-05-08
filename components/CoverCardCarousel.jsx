import React from "react";
import PropTypes from "prop-types";
import { CoverCard } from "./CoverCard";
import { factPropTypes } from "../lib/prop_types";

export const CoverCardCarousel = ({ cards }) => (
  <div className="wcp-cover-card-carousel">
    {cards.map(card => (
      <CoverCard
        isCarouselChild={cards.length > 2}
        key={`${card.label}-${card.id}`}
        coverImage={card.value.image}
        title={card.label}
        url={card.value.url || null}
      >
        {card.value.label}
      </CoverCard>
    ))}
  </div>
);

CoverCardCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired
};
