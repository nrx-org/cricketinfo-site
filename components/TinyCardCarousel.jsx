import React from "react";
import PropTypes from "prop-types";
import { TinyCard } from "./TinyCard";
import { factPropTypes } from "../lib/prop_types";

export const TinyCardCarousel = ({ cards }) => (
  <div className="wcp-tiny-card-carousel">
    {cards.map(card => (
      <TinyCard
        key={`${card.label}-${card.id}`}
        shadowSize="s"
        coverImage={card.value.image}
        imagePosition="left"
        title={card.label}
        content={card.value.label}
      />
    ))}
  </div>
);

TinyCardCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired
};
