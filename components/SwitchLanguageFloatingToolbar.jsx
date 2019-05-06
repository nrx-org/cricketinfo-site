import React from "react";

import { FloatingToolbar } from "./FloatingToolbar";
import { FloatingToolbarButton } from "./FloatingToolbarButton";

import { translationsPropTypes } from "../lib/prop_types";

export const SwitchLanguageFloatingToolbar = ({ translations }) => {
  const leftButton = (
    <FloatingToolbarButton
      label={translations[0].title}
      href={translations[0].url}
    />
  );
  const rightButton = (
    <FloatingToolbarButton
      label={translations[1].title}
      href={translations[1].url}
    />
  );

  return <FloatingToolbar leftButton={leftButton} rightButton={rightButton} />;
};

SwitchLanguageFloatingToolbar.propTypes = {
  translations: translationsPropTypes.isRequired
};
