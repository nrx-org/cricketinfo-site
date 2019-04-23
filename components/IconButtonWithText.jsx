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
    console.warn(
      "Icon Button with Text cannot be both link and button. Please pass either onClick OR url only."
    );
  }

  return (
    <div>
      {url ? (
        <a href={url}>
          <Icon name={name} altText={altText} />
          {children}
        </a>
      ) : (
        <IconButton name={name} altText={altText} onClick={onClick}>
          {children}
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
