import React from "react";
import PropTypes from "prop-types";
import { Pill } from "./Pill";

export const PillList = ({ items, className }) => (
  <div className={`wcp-pill-list ${className}`}>
    {items.map(item => (
      <Pill className="wcp-pill-list-pill" key={item.label}>
        {item.label}
      </Pill>
    ))}
  </div>
);

PillList.defaultProps = {
  items: [],
  className: ""
};

PillList.propTypes = {
  items: PropTypes.shape({
    label: PropTypes.string.isRequired
  }),
  className: PropTypes.string
};
