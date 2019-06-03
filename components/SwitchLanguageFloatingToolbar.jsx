import React from "react";
import { useTracking } from "react-tracking";
import { CHANGE_LANGUAGE_FROM_HOME_PAGE } from "../lib/matomo";

import { FloatingToolbar } from "./FloatingToolbar";
import { FloatingToolbarButton } from "./FloatingToolbarButton";

import { translationsPropTypes } from "../lib/prop_types";

export const SwitchLanguageFloatingToolbar = ({ translations }) => {
  const tracking = useTracking();
  const onClick = (event, url, title) => {
    event.preventDefault();
    tracking.trackEvent(
      CHANGE_LANGUAGE_FROM_HOME_PAGE(title.replace("/read/", ""))
    );
    window.location.pathname = url;
  };
  const leftButton = (
    <FloatingToolbarButton
      label={translations[0].title}
      onClick={e => onClick(e, translations[0].url, translations[0].title)}
    />
  );
  const rightButton = (
    <FloatingToolbarButton
      label={translations[1].title}
      onClick={e => onClick(e, translations[1].url, translations[1].title)}
    />
  );

  return (
    <FloatingToolbar
      stickToTop
      leftButton={leftButton}
      rightButton={rightButton}
    />
  );
};

SwitchLanguageFloatingToolbar.propTypes = {
  translations: translationsPropTypes.isRequired
};
