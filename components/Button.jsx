import React from "react";
import PropTypes from "prop-types";

export const Button = ({
  children,
  type,
  isFullWidth,
  isLink,
  href,
  onClick,
  className
}) => {
  let buttonClass = type === "inverted" ? "wcp-button--inverted " : " ";
  buttonClass += isFullWidth ? "wcp-button--full-width" : "";

  if (!isLink && href) {
    console.warn("Can't add a link to a button, ignoring href prop");
  }

  if (isLink && !href) {
    console.warn("Button is a link but no URL was passed.");
  }

  if (isLink) {
    return (
      <a
        href={href}
        className={`wcp-button ${buttonClass} ${className}`}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`wcp-button ${buttonClass} ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: "",
  className: "",
  isFullWidth: true,
  isLink: false,
  href: "",
  onClick: null
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["inverted"]),
  isFullWidth: PropTypes.bool,
  isLink: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};
