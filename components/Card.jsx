import React from "react";
import PropTypes from "prop-types";

export const Card = ({
  children,
  coverImage,
  title,
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
          className="wcp-card__cover-image"
          src={coverImage.url}
          alt={coverImage.altText}
        />
      ) : null}
      <section className={`wcp-card__content ${contentClassName}`}>
        {title ? <h1 className="wcp-card__title">{title}</h1> : null}
        {children}
      </section>
    </div>
  );
};

Card.defaultProps = {
  coverImage: null,
  title: null,
  shadowSize: "l",
  className: "",
  contentClassName: "",
  imagePosition: "top"
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  coverImage: PropTypes.string,
  title: PropTypes.string,
  shadowSize: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  imagePosition: PropTypes.oneOf(["left", "top"])
};
