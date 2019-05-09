import React from "react";
import PropTypes from "prop-types";

export const Button = ({
  children,
  isInverted,
  isFullWidth,
  href,
  onClick,
  className,
  paddingSize
}) => {
  let buttonClass = isInverted ? " wcp-button--inverted" : " ";
  buttonClass += isFullWidth ? " wcp-button--full-width" : "";
  buttonClass += ` wcp-button--padding-${paddingSize}`;

  const isLink = !!href;

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
  isInverted: false,
  className: "",
  isFullWidth: true,
  href: "",
  onClick: null,
  paddingSize: "m"
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  isInverted: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  paddingSize: PropTypes.oneOf(["s", "m"])
};
