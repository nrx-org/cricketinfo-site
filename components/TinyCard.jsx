import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";

import { Card } from "./Card";

export const TinyCard = ({
  id,
  children,
  coverImage,
  coverImageClassName,
  title,
  titleClassName,
  shadowSize,
  className,
  contentClassName,
  imagePosition,
  content
}) => {
  return (
    <Card
      shadowSize={shadowSize}
      coverImage={coverImage}
      imagePosition={imagePosition}
      title={title}
      titleClassName={`wcp-tiny-card__title ${titleClassName}`}
      className={`wcp-tiny-card ${className}`}
      coverImageClassName={`wcp-tiny-card__cover-image ${coverImageClassName}`}
      contentClassName={`wcp-tiny-card__content ${contentClassName}`}
      id={id}
    >
      <div className="wcp-tiny-card__description">{content}</div>
      {children}
    </Card>
  );
};

TinyCard.defaultProps = {
  id: null,
  children: null,
  coverImage: null,
  coverImageClassName: "",
  title: null,
  titleClassName: "",
  shadowSize: "l",
  className: "",
  contentClassName: "",
  imagePosition: "top",
  content: ""
};

TinyCard.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  coverImage: imagePropTypes,
  coverImageClassName: PropTypes.string,
  title: PropTypes.string,
  titleClassName: PropTypes.string,
  shadowSize: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  imagePosition: PropTypes.oneOf(["left", "top"]),
  content: PropTypes.string
};
