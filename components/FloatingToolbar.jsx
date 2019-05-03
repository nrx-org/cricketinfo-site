import React from "react";
import { PropTypes } from "prop-types";

export const FloatingToolbar = ({ children }) => {
  return (
    <div className="wcp-floating-toolbar">
      {children.reduce((acc, c, i) => {
        if (i === children.length - 1) {
          return acc.concat(c);
        }
        return acc.concat(c, <div className="wcp-floating-toolbar__divider" />);
      }, [])}
    </div>
  );
};

FloatingToolbar.propTypes = {
  children: PropTypes.node.isRequired
};
