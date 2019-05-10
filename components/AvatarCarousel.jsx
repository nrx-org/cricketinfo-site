import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "./Avatar";
import { factPropTypes } from "../lib/prop_types";

export const AvatarCarousel = ({ cards }) => (
  <div className="wcp-avatar-carousel">
    {cards.map(card => (
      <Avatar card={card} />
    ))}
  </div>
);

AvatarCarousel.propTypes = {
  cards: PropTypes.arrayOf(factPropTypes).isRequired
};
