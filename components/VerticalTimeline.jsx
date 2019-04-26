import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { VerticalTimelineItem } from "./VerticalTimelineItem";
import { SectionTitle } from "./SectionTitle";

export const VerticalTimeline = ({ cardData }) => {
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className="wcp-vertical-timeline">
        {cardData.facts.map(fact => {
          const factLabel = fact.label;
          const factId = fact.id;
          return (
            <VerticalTimelineItem key={`${factLabel}-${factId}`} fact={fact} />
          );
        })}
      </div>
    </section>
  );
};

VerticalTimeline.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
