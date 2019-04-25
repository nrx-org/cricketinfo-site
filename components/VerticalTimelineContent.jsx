import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { VerticalTimelineContentSingle } from "./VerticalTimelineContentSingle";
import { SectionTitle } from "./SectionTitle";

export const VerticalTimelineContent = ({ cardData }) => {
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className="wcp-fact-card__vertical-timeline-content">
        {cardData.facts.map(fact => {
          const factLabel = fact.label;
          const factId = fact.id;
          return (
            <VerticalTimelineContentSingle
              key={`${factLabel}-${factId}`}
              fact={fact}
            />
          );
        })}
      </div>
    </section>
  );
};

VerticalTimelineContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
