import React from "react";
import PropTypes from "prop-types";
import { factCardDataPropTypes } from "../lib/prop_types";
import { TimelineItem } from "./TimelineItem";
import { SectionTitle } from "./SectionTitle";

export const Timeline = ({ cardData, type, innerCardType }) => {
  const derivedClassName =
    type === "vertical" ? "wcp-vertical-timeline" : "wcp-horizontal-timeline";
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className={`wcp-timeline ${derivedClassName}`}>
        {cardData.facts.map(fact => {
          const factLabel = fact.label;
          const factId = fact.id;
          return (
            <TimelineItem
              key={`${factLabel}-${factId}`}
              fact={fact}
              type={type}
              innerCardType={innerCardType}
            />
          );
        })}
      </div>
    </section>
  );
};

Timeline.defaultProps = {
  innerCardType: "tiny"
};

Timeline.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  type: PropTypes.string.isRequired,
  innerCardType: PropTypes.string
};
