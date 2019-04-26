import React from "react";
import { factPropTypes } from "../lib/prop_types";
import { TinyCard } from "./TinyCard";

export const VerticalTimelineItem = ({ fact }) => {
  const innerCardsList = fact.value.innerCards.map(g => {
    return (
      <TinyCard
        key={`${g.label}-${g.id}`}
        shadowSize="s"
        coverImage={g.value.image}
        imagePosition="left"
        title={g.label}
        content={g.value.label}
      />
    );
  });

  return (
    <div className="wcp-vertical-timeline-item">
      <h2 className="wcp-vertical-timeline-item__label">
        {fact.label}
        {fact.labelHelperText ? (
          <span className="wcp-vertical-timeline-item__label-helper-text">
            {" "}
            {"("}
            {fact.labelHelperText}
            {")"}
          </span>
        ) : (
          ""
        )}
      </h2>
      <div className="wcp-vertical-timeline-item__content">
        {fact.value.label}
      </div>
      <div className="wcp-vertical-timeline-item__inner-cards-list">
        {innerCardsList}
      </div>
      <div className="wcp-vertical-timeline-item__line-and-dot">
        <div className="wcp-vertical-timeline-item__line-and-dot__dot" />
        <div className="wcp-vertical-timeline-item__line-and-dot__line" />
      </div>
    </div>
  );
};

VerticalTimelineItem.propTypes = {
  fact: factPropTypes
};

VerticalTimelineItem.defaultProps = {
  fact: null
};
