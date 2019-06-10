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
                <h4 className="wcp-list-card__item__label">{fact.label}</h4>
                {fact.value.label ? (
                  <div className="wcp-list-card__item__description">
                    {fact.value.label}
                  </div>
                ) : null}
              </div>
              {fact.value.facts[0] ? (
                <div className="wcp-list-card__tiny-cards-carousel-wrapper">
                  <TinyCardCarousel cards={fact.value.facts} />
                </div>
              ) : null}
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
