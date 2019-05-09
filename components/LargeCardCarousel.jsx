import React from "react";
import PropTypes from "prop-types";
import { LargeCard } from "./LargeCard";
import { factPropTypes } from "../lib/prop_types";

export const LargeCardCarousel = ({ cards }) => (
  <div className="wcp-large-card-carousel">
    {cards.map(c => (
      <LargeCard
        id={c.id}
        text={c.label}
        href={c.value.url}
        coverImage={c.value.image}
        className="wcp-large-card-carousel__card"
      />
    ))}
  </div>
);

LargeCardCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired
};
