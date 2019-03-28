import React from "react";
import PropTypes from "prop-types";

export const Card = ({ children, coverImage, title, shadowSize, className }) => {
  const shadowClass = `wcp-card--shadow-${shadowSize}`;
  return (
    <div className={`wcp-card ${shadowClass} ${className}`}>
      {coverImage ? (
        <img className="wcp-card__cover-image" src={coverImage} alt="Cover" />
      ) : null}
      <section className="wcp-card__content">
        {title ? <h1>{title}</h1> : null}
        {children}
      </section>
    </div>
  );
};

Card.defaultProps = {
  coverImage: null,
  title: null,
  shadowSize: "l",
  className: ""
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  coverImage: PropTypes.string,
  title: PropTypes.string,
  shadowSize: PropTypes.string,
  className: PropTypes.string
};
