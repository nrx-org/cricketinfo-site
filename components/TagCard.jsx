import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { SectionTitle } from "./SectionTitle";
import { TinyCard } from "./TinyCard";

export const TagCard = ({ cardData }) => {
  return (
    <section className="wcp-tag-card">
      <SectionTitle>{cardData.title}</SectionTitle>
      <div className="wcp-tag-card__table">
        {cardData.facts.map(fact => (
          <div className="wcp-tag-card__table__row">
            <div className="wcp-tag-card__table__label wcp-tag-card__table__column">
              {fact.tag}
            </div>
            <TinyCard
              key={fact.id}
              title={fact.label}
              href={fact.value.url}
              coverImage={fact.value.image}
              className="wcp-tag-card__table__tiny-card wcp-tag-card__table__column"
            >
              {fact.value.label}
            </TinyCard>
          </div>
        ))}
      </div>
    </section>
  );
};

TagCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
