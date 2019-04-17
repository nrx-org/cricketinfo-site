import React from "react";
import { PropTypes } from "prop-types";

import { IconButton } from "./IconButton";

export const IconButtonWithText = ({ name, altText, text, onClick }) => (
  <div>
    <IconButton name={name} onClick={onClick} altText={altText} />
    <a href={onClick}>{text}</a>
  </div>
);

IconButtonWithText.propTypes = {
  name: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.string.isRequired
};
