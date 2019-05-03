import React from "react";
import PropTypes from "prop-types";
import { Icon } from "./Icon";

export const FloatingToolbarButton = ({ label, icon, href, onClick }) => {
  if (href && onClick) {
    // eslint-disable-next-line no-console
    console.warn(
      'FloatingToolbarButton was given both an "onClick" and an "href" prop. The behaviour in this case is undefined.'
    );
  }

  const content = (
    <>
      {icon ? (
        <Icon
          name={icon.name}
          altText={icon.altText}
          className="wcp-floating-toolbar-button__icon"
        />
      ) : null}
      <span className="wcp-floating-toolbar-button__text">{label}</span>
    </>
  );

  return href ? (
    <a className="wcp-floating-toolbar-button" href={href}>
      {content}
    </a>
  ) : (
    <button
      type="button"
      className="wcp-floating-toolbar-button"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

FloatingToolbarButton.defaultProps = {
  href: null,
  onClick: null
};

FloatingToolbarButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired
  }).isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func
};
