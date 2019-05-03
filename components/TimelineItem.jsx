import React from "react";
import { factPropTypes } from "../lib/prop_types";
import { TinyCardCarousel } from "./TinyCardCarousel";

export const TimelineItem = ({ fact }) => (
  <div className="wcp-timeline-item">
    <h2 className="wcp-timeline-item__label">
      {fact.label}
      {fact.note ? (
        <span className="wcp-timeline-item__label-helper-text">
          {" "}
          {"("}
          {fact.note}
          {")"}
        </span>
      ) : (
        ""
      )}
    </h2>

    <div className="wcp-timeline-item__content">{fact.value.label}</div>
    <div className="wcp-timeline-item__line-and-dot">
      <div className="wcp-timeline-item__line-and-dot__dot" />
      <div className="wcp-timeline-item__line-and-dot__line" />
    </div>
    <TinyCardCarousel cards={fact.value.facts} />
  </div>
);

TimelineItem.propTypes = {
  fact: factPropTypes
};

TimelineItem.defaultProps = {
  fact: null
};
