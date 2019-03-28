import React from "react";
import PropTypes from "prop-types";

export const Card = ({ children, coverImage, title, shadowSize }) => {
  const shadowClass = `wcp-card__shadow-${shadowSize}`;
  return (
    <div className={`wcp-card ${shadowClass}`}>
      {coverImage ? (
        <div>
          <img src={coverImage} alt="Cover" />
        </div>
      ) : null}
      <section>
        {title ? <h1>{title}</h1> : null}
        {children}
      </section>
    </div>
  );
};

Card.defaultProps = {
  coverImage: null,
  title: null,
  shadowSize: "l"
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  coverImage: PropTypes.string,
  title: PropTypes.string,
  shadowSize: PropTypes.string
};
