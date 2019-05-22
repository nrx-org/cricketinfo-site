import React from "react";
import PropTypes from "prop-types";
import { LargeCard } from "./LargeCard";
import { factPropTypes } from "../lib/prop_types";

export const LargeCardCarousel = ({ cards, cardOrientation }) => (
  <div className="wcp-large-card-carousel">
    {cards.map(c => (
      <LargeCard
        id={c.id}
        title={c.label}
        caption={c.value.label}
        href={c.value.url}
        coverImage={c.value.image}
        buttonText={c.value.buttonText ? c.value.buttonText : "Know More"}
        className="wcp-large-card-carousel__card"
        cardOrientation={cardOrientation}
      />
    ))}
  </div>
);

LargeCardCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired,
  cardOrientation: PropTypes.string
};

LargeCardCarousel.defaultProps = {
  cardOrientation: "horizontal"
};
