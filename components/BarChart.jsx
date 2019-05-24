import React from "react";
import PropTypes from "prop-types";
import { factPropTypes } from "../lib/prop_types";

export const BarChart = ({ facts }) => {
  return (
    <section>
      <div className="wcp-bar-chart">
        {facts.map(fact => {
          const factId = fact.id;
          const factLabel = fact.label;
          const factPercentage = fact.value;
          const barStyle = {
            width: `${factPercentage}%`
          };
          return (
            <div key={factId} className="wcp-bar-chart__single-bar">
              <div className="wcp-bar-chart__single-bar__label">
                {factLabel}
              </div>
              <div className="wcp-bar-chart__single-bar__percentage">
                {`${factPercentage}%`}
              </div>
              <div className="wcp-bar-chart__single-bar__bar">
                <div
                  className="wcp-bar-chart__single-bar__bar__inner"
                  style={barStyle}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

BarChart.propTypes = {
  facts: PropTypes.arrayOf(factPropTypes).isRequired
};
