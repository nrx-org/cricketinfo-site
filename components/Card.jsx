import React from "react";
import PropTypes from "prop-types";

import { imagePropTypes } from "../lib/prop_types";

export const Card = ({
  children,
  coverImage,
  coverImageClassName,
  title,
  titleClassName,
  shadowSize,
  className,
  contentClassName,
  imagePosition
}) => {
  const shadowClass = `wcp-card--shadow-${shadowSize}`;
  const imagePositionClass =
    imagePosition === "left" ? "wcp-card--image-left" : "";

  return (
    <div
      className={`wcp-card ${shadowClass} ${className} ${imagePositionClass} `}
    >
      {coverImage ? (
        <img
          className={`wcp-card__cover-image ${coverImageClassName}`}
          src={coverImage.url}
          alt={coverImage.altText}
        />
      ) : null}
      <section className={`wcp-card__content ${contentClassName}`}>
        {title ? (
          <h1 className={`wcp-card__title ${titleClassName}`}>{title}</h1>
        ) : null}
        {children}
      </section>
    </div>
  );
};

Card.defaultProps = {
  children: null,
  coverImage: null,
  coverImageClassName: "",
  title: null,
  titleClassName: "",
  shadowSize: "l",
  className: "",
  contentClassName: "",
  imagePosition: "top"
};

Card.propTypes = {
  children: PropTypes.node,
  coverImage: imagePropTypes,
  coverImageClassName: PropTypes.string,
  title: PropTypes.string,
  titleClassName: PropTypes.string,
  shadowSize: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  imagePosition: PropTypes.oneOf(["left", "top"])
};
