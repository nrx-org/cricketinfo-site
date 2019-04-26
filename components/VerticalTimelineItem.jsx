import React from "react";
import { factPropTypes } from "../lib/prop_types";
import { TinyCardCarousel } from "./TinyCardCarousel";

export const VerticalTimelineItem = ({ fact }) => (
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
    <TinyCardCarousel cards={fact.value.innerCards} />
    <div className="wcp-vertical-timeline-item__line-and-dot">
      <div className="wcp-vertical-timeline-item__line-and-dot__dot" />
      <div className="wcp-vertical-timeline-item__line-and-dot__line" />
    </div>
  </div>
);

VerticalTimelineItem.propTypes = {
  fact: factPropTypes
};

VerticalTimelineItem.defaultProps = {
  fact: null
};
