import React from "react";
import PropTypes from "prop-types";
import { factPropTypes } from "../lib/prop_types";
import { TinyCardCarousel } from "./TinyCardCarousel";
import { LargeCardCarousel } from "./LargeCardCarousel";

export const TimelineItem = ({ fact, innerCardType }) => (
  <div className="wcp-timeline-item">
    <div className="wcp-timeline-item__text-content">
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
    </div>
    <div className="wcp-timeline-item__line-and-dot">
      <div className="wcp-timeline-item__line-and-dot__dot" />
      <div className="wcp-timeline-item__line-and-dot__line" />
    </div>
    {innerCardType === "tiny" ? (
      <TinyCardCarousel cards={fact.value.facts} />
    ) : (
      <LargeCardCarousel cards={fact.value.facts} cardOrientation="vertical" />
    )}
  </div>
);

TimelineItem.propTypes = {
  fact: factPropTypes,
  innerCardType: PropTypes.string
};

TimelineItem.defaultProps = {
  fact: null,
  innerCardType: "tiny"
};
