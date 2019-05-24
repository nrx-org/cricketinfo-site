import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { SectionTitle } from "./SectionTitle";
import { TinyCardCarousel } from "./TinyCardCarousel";

export const TinyCardCarouselWithInfo = ({ cardData }) => {
  return (
    <section className="wcp-tiny-card-carousel-with-info">
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className="wcp-tiny-card-carousel-with-info-content">
        <div
          className="wcp-tiny-card-carousel-with-info__item"
          key={cardData.id}
        >
          <div className="wcp-tiny-card-carousel-with-info__item__text-content">
            <div className="wcp-tiny-card-carousel-with-info__item__description">
              {cardData.label}
            </div>
          </div>
          <div className="wcp-tiny-card-carousel-with-info__tiny-cards-carousel-wrapper">
            <TinyCardCarousel cards={cardData.facts} />
          </div>
        </div>
      </div>
    </section>
  );
};

TinyCardCarouselWithInfo.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
