import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { SectionTitle } from "./SectionTitle";
import { TinyCardCarousel } from "./TinyCardCarousel";

export const Blurbs = ({ cardData }) => {
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className="wcp-blurbs">
        {cardData.facts.map(fact => {
          return (
            <div className="wcp-blurbs__item" key={fact.id}>
              <div className="wcp-blurbs__item__text-content">
                <h2 className="wcp-blurbs__item__label">{fact.label}</h2>
              </div>
              <div className="wcp-blurbs__tiny-cards-carousel-wrapper">
                <TinyCardCarousel cards={fact.value.facts} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

Blurbs.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
