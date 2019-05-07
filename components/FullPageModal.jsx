import React from "react";
import PropTypes from "prop-types";

export const FullPageModal = ({ children }) => (
  <div className="wcp-full-page-modal">{children}</div>
);

FullPageModal.propTypes = {
  children: PropTypes.node.isRequired
};
