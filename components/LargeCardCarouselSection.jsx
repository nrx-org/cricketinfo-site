import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { LargeCardCarousel } from "./LargeCardCarousel";

export const LargeCardCarouselSection = ({ cardData }) => (
  <section>
    <h1 className="wcp-large-card-carousel-section__title">{cardData.title}</h1>
    <LargeCardCarousel cards={cardData.facts} />
  </section>
);

LargeCardCarouselSection.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
