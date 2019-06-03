import React from "react";
import PropTypes from "prop-types";

import { articleUiStrings } from "../lib/ui_strings";
import { getHomeUrl } from "../lib/urls";
import { Icon } from "./Icon";

export const HomeButton = ({ lang }) => (
  <a className="wcp-home-button" href={getHomeUrl(lang)}>
    <Icon name="cricketinfo-ball-logo" altText="CricketInfo.io logo" />
    <span>{articleUiStrings.goHome[lang]}</span>
  </a>
);

HomeButton.propTypes = {
  lang: PropTypes.string.isRequired
};
