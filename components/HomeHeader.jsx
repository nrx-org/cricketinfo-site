import React from "react";
import { LiveScoreContainer } from "./LiveScoreContainer";

export const HomeHeader = () => (
  <header className="wcp-home-header">
    <div className="wcp-home-header__logo__container">
      <img
        className="wcp-home-header__logo"
        src="/static/images/logo.svg"
        alt="World Cup logo"
      />
    </div>
    <LiveScoreContainer />
  </header>
);

HomeHeader.defaultProps = {};

HomeHeader.propTypes = {};
