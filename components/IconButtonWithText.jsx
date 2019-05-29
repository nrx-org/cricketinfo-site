import React from "react";
import { PropTypes } from "prop-types";

import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { OneOfPropType } from "../lib/prop_types";

export const IconButtonWithText = ({
  name,
  altText,
  url,
  onClick,
  children
}) => {
  if (url && onClick) {
    // eslint-disable-next-line no-console
    console.warn(
      "Icon Button with Text cannot be both link and button. Please pass either onClick OR url only."
    );
  }

  return (
    <div className="wcp-icon-button-with-text">
      {url ? (
        <a href={url} className="wcp-icon-button-with-text__item">
          <Icon
            name={name}
            altText={altText}
            // className="wcp-icon-button-with-text__icon"
          />
          <span className="wcp-icon-button-with-text__text">{children}</span>
        </a>
      ) : (
        <IconButton
          name={name}
          altText={altText}
          onClick={onClick}
          className="wcp-icon-button-with-text__item"
        >
          <span className="wcp-icon-button-with-text__text">{children}</span>
        </IconButton>
      )}
    </div>
  );
};

IconButtonWithText.defaultProps = {
  url: "",
  onClick: ""
};

IconButtonWithText.propTypes = {
  name: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  url: OneOfPropType,
  onClick: OneOfPropType,
  children: PropTypes.node.isRequired
};
