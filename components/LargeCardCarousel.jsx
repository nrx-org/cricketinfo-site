import React from "react";
import PropTypes from "prop-types";
import { LargeCard } from "./LargeCard";

export const LargeCardCarousel = ({ cards }) => (
  <div>
    {cards.map(c => (
      <LargeCard href={c.value.url} coverImage={c.value.image}>
        {c.label}
      </LargeCard>
    ))}
  </div>
);

LargeCardCarousel.propTypes = {};
