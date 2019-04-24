import React from "react";
import { factPropTypes } from "../lib/prop_types";
import { TinyCard } from "./TinyCard";

export const VerticalTimelineContentSingle = ({ fact }) => {
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
    <div className="wcp-fact-card__vertical-timeline-content__item">
      <h2 className="wcp-fact-card__vertical-timeline-content__item__label">
        {fact.label}
        {fact.labelHelperText ? (
          <span className="wcp-fact-card__vertical-timeline-content__item__label-helper-text">
            {" "}
            {"("}
            {fact.labelHelperText}
            {")"}
          </span>
        ) : (
          ""
        )}
      </h2>
      <div className="wcp-fact-card__vertical-timeline-content__item__content">
        {fact.value.label}
      </div>
      <div className="wcp-fact-card__vertical-timeline-content__inner-cards-list">
        {innerCardsList}
      </div>
      <div className="wcp-fact-card__vertical-timeline-content__item__line-and-dot">
        <div className="dot" />
        <div className="line" />
      </div>
    </div>
  );
};

VerticalTimelineContentSingle.propTypes = {
  fact: factPropTypes
};

VerticalTimelineContentSingle.defaultProps = {
  fact: null
};
