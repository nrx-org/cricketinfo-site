import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { SectionTitle } from "./SectionTitle";
import { TinyCardCarousel } from "./TinyCardCarousel";

export const ListCard = ({ cardData }) => {
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className="wcp-list-card">
        {cardData.facts.map(fact => {
          return (
            <div className="wcp-list-card__item" key={fact.id}>
              <div className="wcp-list-card__item__text-content">
                <h2 className="wcp-list-card__item__label">{fact.label}</h2>
              </div>
              <div className="wcp-list-card__tiny-cards-carousel-wrapper">
                <TinyCardCarousel cards={fact.value.facts} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

ListCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
